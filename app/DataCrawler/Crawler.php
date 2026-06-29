<?php
/**
 * Created by PhpStorm.
 * User: michael
 * Date: 16/06/18
 * Time: 14:26
 */

namespace App\DataCrawler;

use App\Competition;
use App\Game as CompetitionGame;
use App\Enums\GameSubTypes;
use App\DataCrawler\Bracket;
use App\DataCrawler\BracketTie;
use App\DataCrawler\BracketSource;
use Illuminate\Http\Client\Pool;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Arr;
use \Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Log;

class Crawler
{

    protected string $id;

    protected string $source = Competition::SOURCE_FOOTBALL_DATA;
    protected ?int $competition365Id = null;

    public function __construct(string $id)
    {
        $this->id = $id;
    }

    public static function getInstance($id = "wc") {
        return new static($id);
    }

    /**
     * Select which feed supplies matches/teams/standings. With SOURCE_365 the fetch* entry points route
     * to their *365 variants (everything in native 365 ids; no football-data / translate365TeamId needed).
     */
    public function withSource(string $source, ?int $competition365Id): static
    {
        $this->source = $source;
        $this->competition365Id = $competition365Id;
        return $this;
    }

    private static function parseGame($match_json)
    {
        $startTime =  \DateTime::createFromFormat(\DateTime::ISO8601, data_get($match_json, 'utcDate'));
        $type = data_get($match_json, 'stage') == "GROUP_STAGE" ? "group_stage" : "knockout";
        $homeTeamId = data_get($match_json, 'homeTeam.id');
        $awayTeamId = data_get($match_json, 'awayTeam.id');
        if (is_null($homeTeamId) || is_null($awayTeamId)){
            return null;
        }

        // NOTE: results/scores, the knockout winner and the started/done status are no longer
        // read from the football-data API (it returns null results). The football-data response is
        // only used for the game *structure* (external id, teams, stage/group, kick-off, two-leg
        // layout). The actual results are overlaid from 365scores in overlayScoresFrom365().
        return new Game(
            data_get($match_json, 'id'),
            $type,
            $type == "group_stage" ? data_get($match_json, 'group') : data_get($match_json, 'stage'),
            $homeTeamId,
            $awayTeamId,
            $startTime ? $startTime->format("U") : null,
            null, // resultHome
            null, // resultAway
            null, // fullResultHome
            null, // fullResultAway
            null, // totalResultHome
            null, // totalResultAway
            null, // koWinnerExternalId
            null, // koLeg
            false, // isDone
            false, // isStarted
        );
    }

    private function calcSecondLegKoWinnerExternalId(Game $secondLegGame, Game $firstLegGame){

        if (!($secondLegGame->isDone && $firstLegGame->isDone)) {
            return null;
        }
        $goalsPerTeam = [
            $firstLegGame->teamHomeExternalId => $firstLegGame->resultHome,
            $firstLegGame->teamAwayExternalId => $firstLegGame->resultAway
        ];
        $homeTeamExternalId = $secondLegGame->teamHomeExternalId;
        $awayTeamExternalId = $secondLegGame->teamAwayExternalId;

        $goalsPerTeam[$homeTeamExternalId] += $secondLegGame->totalResultHome;
        $goalsPerTeam[$awayTeamExternalId] += $secondLegGame->totalResultAway;

        if ($goalsPerTeam[$homeTeamExternalId] > $goalsPerTeam[$awayTeamExternalId]){
            return $homeTeamExternalId;
        }
        if ($goalsPerTeam[$homeTeamExternalId] < $goalsPerTeam[$awayTeamExternalId]){
            return $awayTeamExternalId;
        }
        throw new \Exception("Game is done but could not decide ko_qualifier gameExternalId=$secondLegGame->externalId, firstLegExternalId=$firstLegGame->externalId");

    }

    private function apiCall(string $additionalPath, bool $addCompetitionPrefix = true)
    {
        $url = config('api.path');
        if ($addCompetitionPrefix) {
            $url .= "competitions/" . $this->id;
        }
        $url .= "". $additionalPath;

        $apiTokens = Arr::shuffle(explode(",", config('api.api_token')));
        return retry(count($apiTokens), function ($attempt) use ($url, $apiTokens) {
            $headers = ['X-Auth-Token' => $apiTokens[$attempt-1]];
            $res = Http::withHeaders($headers)->get($url);

            \Log::debug("[ApiCall] {$url} - {$res->body()}");

            $res->throw();

            return $res->json();
        });
    }

    public function fetchTeams(): Collection
    {
        if ($this->source === Competition::SOURCE_365) {
            return $this->fetchTeams365($this->competition365Id);
        }
        $data = $this->apiCall('/standings');
        $standings = data_get($data, 'standings');

        $groups = collect($standings)->where('type', 'TOTAL');
        $teams = [];
        foreach ($groups as $group){
            $group_name = data_get($group, 'group');
            $group_id = static::transformGroupNameToGroupId($group_name);
            $group_teams = data_get($group, 'table.*.team');
            $teams = array_merge($teams, array_map(function($t) use($group_id){
                return array_merge(['group_id' => $group_id, 'crestUrl' => $t["crest"]], $t);
            }, $group_teams));
        }
        return collect($teams);
    }

    public function fetchGames($competitionType = Competition::TYPE_WC, ?int $competition365Id = null)
    {
        if ($this->source === Competition::SOURCE_365) {
            return $this->fetchGames365($this->competition365Id ?? $competition365Id, $competitionType);
        }
        if (app()->environment("testing")) {
            $data = null;
        } else {
            $data = $this->apiCall('/matches');
        }

        $matches = data_get($data, 'matches');

        $parsedMatches = collect($matches)->map(fn($m) => self::parseGame($m))->filter();
        $parsedMatchesById = $parsedMatches->keyBy('externalId');

        // football-data returns null results, so overlay the real results/scores from 365scores.
        if ($competition365Id) {
            $this->overlayScoresFrom365($parsedMatches, $competition365Id);
        }

        $twoLegsGames = $parsedMatches->filter(fn (Game $game) => $this->isTwoLegedTie($game, $competitionType));
        $groupedByLegs = $twoLegsGames->groupBy(fn(Game $game) => $this->gameToLegsId($game))->map(
            fn(Collection|Game $games) => $games->sortBy('startTime')->map(fn($g)=>$g->externalId)
        );
        foreach ($groupedByLegs as $legsId => $gamesIdOrdered){
            $firstLegGame = $parsedMatchesById[$gamesIdOrdered[0]];
            $secondLegGame = $parsedMatchesById[$gamesIdOrdered[1]];
            $parsedMatchesById[$firstLegGame->externalId]->koLeg = CompetitionGame::LEG_TYPE_FIRST;
            $parsedMatchesById[$secondLegGame->externalId]->koLeg = CompetitionGame::LEG_TYPE_SECOND;
            $parsedMatchesById[$secondLegGame->externalId]->koWinnerExternalId = $this->calcSecondLegKoWinnerExternalId($secondLegGame, $firstLegGame);
        }
        return $parsedMatchesById->values();
    }

    private function isTwoLegedTie(Game $game, $competitionType): bool
    {
        if ($competitionType == Competition::TYPE_UCL){
            if ($game->type == CompetitionGame::TYPE_KNOCKOUT && $game->subType != GameSubTypes::FINAL){
                return true;
            }
        }
        return false;
    }

    private function gameToLegsId(Game $game): string
    {
        $playingTeams = collect([$game->teamAwayExternalId, $game->teamHomeExternalId])->sort()->values();
        return $game->type."_".$game->subType."_".$playingTeams[0].$playingTeams[1];  
    }

    public function fetchScorers(Collection $teamIds, int $competition365Id): Collection
    {
        return $this->fetchScorers365($teamIds, $competition365Id);
    }

    public function fetchScorersOfLatestGames(int $competition365Id, Collection $dbGamesCollection, $gamesToFixScorers = [], int $startedBeforeMins = 60 * 4): Collection
    {
        
        $relevantGames = $this->fetchLatestGamesFrom365($competition365Id, $gamesToFixScorers, $startedBeforeMins);
        $gameIdOn365ToDbGameIdMap = $this->map365GameIdsToDbGames($dbGamesCollection, $relevantGames);

        \Log::debug("[Crawler][fetchScorersOfLatestGames] - Going to send requests for games:\n".$gameIdOn365ToDbGameIdMap->keys()->toJson()."\n whose matching db game ids are: \n".$gameIdOn365ToDbGameIdMap->values()->toJson());

        $userAgents = $this->getUserAgents();
        $responses = Http::pool(function (Pool $pool) use ($gameIdOn365ToDbGameIdMap, $userAgents) {
            return $gameIdOn365ToDbGameIdMap->keys()->map(
                function($gameId) use($pool, $userAgents) {
                    $langId = rand(1,50);
                    $baseUrl = "https://webws.365scores.com/web/game/?appTypeId=1&langId=$langId&userCountryId=6";
                    return $pool->as($gameId)->withUserAgent(Arr::random($userAgents))->get($baseUrl . "&gameId=$gameId");
                }
            )->toArray();
        });

        $scorersDataPerGameId = collect();

        foreach ($responses as $gameId => $response) {
            $gameData = $response->collect("game");
            $dbGameId = $gameIdOn365ToDbGameIdMap->get($gameId);
            $scorersDataPerGameId[$dbGameId] = $this->getScoresrsDataFromGame($gameData);
        }

        return $scorersDataPerGameId;
    }

    public function fetchPlayersByTeamId($teamId)//450
    {
        return $this->fetchPlayersByTeamId365score($teamId);

        return collect(
            $this->apiCall("/teams/{$teamId}?limit=300", false)["squad"]
        )->map(fn($data) => new Player($data["id"], $data["name"], $teamId, $data["shirtNumber"], $data["position"]));
    }

    public static function transformGroupNameToGroupId($groupName)
    {
        return strtoupper(str_replace(" ", "_", $groupName));
    }

    public function fetchGroupStandings(int $totalGamesInGroup)
    {
        if ($this->source === Competition::SOURCE_365) {
            return $this->fetchGroupStandings365($this->competition365Id, $totalGamesInGroup);
        }
        $data = $this->apiCall('/standings');
        $standings = data_get($data, 'standings');
        $groups = collect($standings)->where('type', 'TOTAL');
        $done_groups = $groups->filter(function($group) use ($totalGamesInGroup){
            # verifying all games were played in a group:
            return array_sum( data_get($group, "table.*.playedGames") ) / 2 == $totalGamesInGroup;
        });
        $res = [];
        foreach($done_groups as $group_data){
            $table = data_get($group_data, 'table');
            $group_name = data_get($group_data, 'group');
            $group_id = static::transformGroupNameToGroupId($group_name);
            $standings = [];
            foreach ($table as $row){
                array_push($standings, [
                    "position" => data_get($row, "position"),
                    "team_ext_id" => data_get($row, "team.id")
                ]);
            }
            $res[$group_id] = collect($standings);
        }
        return $res;
    }

    /**
     * @param $teamId
     *
     * @return Collection
     */
    protected function fetchPlayersByTeamId365score($teamId): Collection
    {
        $teamId365score = self::translate365TeamId($teamId);

        $data = Http::get("https://webws.365scores.com/web/squads/?appTypeId=5&langId=2&timezoneName=Asia/Jerusalem&userCountryId=6&competitors={$teamId365score}");

        return $data->collect("squads.0.athletes")
            ->filter(fn($data) => !in_array(data_get($data, "formationPosition.name"), ['מאמן', 'עוזר מאמן', 'מנג\'ר'])) // filtering out coaches
            ->map(
                fn($data) => new Player(
                    $data["id"],
                    $data["name"],
                    $teamId,
                    ($data["jerseyNum"] ?? null) != -1 ? $data["jerseyNum"] : null,
                    $data["position"]["name"] ?? null
                )
            );
    }

    /**
     * @param $teamId
     *
     * @return int
     */
    public static function translate365TeamId($teamId): int
    {
        return match ((int)$teamId) {
            805  => 2373, // Belgium
            773  => 5061, // France
            791  => 5075, // Ecuador
            8601 => 2377, // Netherlands
            8030 => 5079, // Qatar
            804  => 5102, // Senegal
            770  => 5054, // England
            840  => 5091, // Iran
            771  => 2389, // United States
            833  => 5043, // Wales
            762  => 2378, // Argentina
            769  => 5106, // Mexico
            794  => 5038, // Poland
            801  => 5087, // Saudi Arabia
            779  => 2380, // Australia
            782  => 5027, // Denmark
            802  => 5104, // Tunisia
            793  => 5424, // Costa Rica
            759  => 2372, // Germany
            766  => 2382, // Japan
            760  => 5050, // Spain
            828  => 2388, // Canada
            799  => 5055, // Croatia
            815  => 5093, // Morocco
            764  => 2379, // Brazil
            781  => 2387, // Cameroon
            780  => 2374, // Serbia
            788  => 5032, // Switzerland
            763  => 5094, // Ghana
            765  => 5028, // Portugal
            772  => 2383, // South Korea
            758  => 5073, // Uruguay
            8873 => 5069, // Scotland  
            827 => 5026, // Hungary  
            1065 => 5029, // Albania  
            784 => 2375, // Italy  
            777 => 5041, // Slovenia  
            816 => 5059, // Austria  
            811 => 5060, // Romania  
            768 => 5039, // Slovakia  
            790 => 5057, // Ukraine  
            1978 => 5066, // Georgia  
            803 => 5047, // Turkey
            798 => 5040, // Czech Republic

            // WC 2026:
            761  => 5070,  // Paraguay
            774  => 5103,  // South Africa
            778  => 5109,  // Algeria
            783  => 2391,  // New Zealand
            792  => 2371,  // Sweden
            818  => 5071,  // Colombia
            825  => 5100,  // Egypt
            836  => 5422,  // Haiti
            1060 => 5048,  // Bosnia-Herzegovina
            1836 => 5414,  // Panama
            1930 => 5411,  // Cape Verde Islands
            1934 => 14650, // Congo DR
            1935 => 2385,  // Ivory Coast
            8049 => 5083,  // Jordan
            8062 => 5078,  // Iraq
            8070 => 5085,  // Uzbekistan
            8872 => 2376,  // Norway
            9460 => 24397, // Curaçao

            // Champions League:
            5 => 331, // FC Bayern München  
            1876 => 1824, // FC København  
            610 => 945, // Galatasaray SK  
            66 => 105, // Manchester United FC  
            57 => 104, // Arsenal FC  
            674 => 725, // PSV  
            546 => 481, // Racing Club de Lens  
            559 => 135, // Sevilla FC  
            28 => 392, // 1. FC Union Berlin  
            86 => 131, // Real Madrid CF  
            5613 => 895, // Sporting Clube de Braga  
            113 => 234, // SSC Napoli  
            108 => 224, // FC Internazionale Milano  
            1877 => 1739, // FC Red Bull Salzburg  
            92 => 154, // Real Sociedad de Fútbol  
            1903 => 888, // Sport Lisboa e Benfica  
            78 => 134, // Club Atlético de Madrid  
            732 => 754, // Celtic FC  
            675 => 691, // Feyenoord Rotterdam  
            110 => 236, // SS Lazio  
            98 => 227, // AC Milan  
            4 => 341, // Borussia Dortmund  
            67 => 116, // Newcastle United FC  
            524 => 480, // Paris Saint-Germain FC  
            1871 => 1139, // BSC Young Boys  
            7283 => 8957, // FK Crvena Zvezda  
            65 => 110, // Manchester City FC  
            721 => 7171, // RB Leipzig  
            81 => 132, // FC Barcelona  
            503 => 887, // FC Porto  
            1864 => 1191, // Royal Antwerp FC  
            1887 => 1955, // FK Shakhtar Donetsk 
            default => $teamId,
        };
    }

    /**
     * @param Collection $teamIds
     *
     * @return Collection
     */
    protected function fetchScorers365(Collection $teamIds, int $competition365Id): Collection
    {
        $userAgents = $this->getUserAgents();

        $responses = Http::pool(function (Pool $pool) use ($teamIds, $userAgents, $competition365Id) {
            return $teamIds->map(
                function($teamId) use($pool, $userAgents, $competition365Id) {
                    $langId = rand(1,50);
                    $baseUrl = "https://webws.365scores.com/web/stats/?appTypeId=5&langId=$langId&userCountryId=6&competitions=$competition365Id";
                    return $pool->as($teamId)->withUserAgent(Arr::random($userAgents))->get($baseUrl . "&competitors=" . self::translate365TeamId($teamId));
                }
            )->toArray();
        });

        $players = collect();

        /** @var Response $response */
        foreach ($responses as $teamId => $response) {
            $stats = $response->collect("stats.athletesStats");

            if ($scorerStats = $stats->firstWhere("statsTypes.0.typeId", 1)) {
                collect($scorerStats["rows"])->each(fn($data) => $players->add(new Player(
                    $data["entity"]["id"],
                    $data["entity"]["name"],
                    $teamId,
                    null,
                    null,
                    $data["stats"][0]["value"]
                )));
            }
            if ($assistsStats = $stats->firstWhere("statsTypes.0.typeId", 2)) {
                foreach ($assistsStats["rows"] as $data) {
                    /** @var Player $player */
                    if ($player = $players->firstWhere("externalId", $data["entity"]["id"])) {
                        $player->setAssists($data["stats"][0]["value"]);
                    } else {
                        $players->add(new Player(
                            $data["entity"]["id"],
                            $data["entity"]["name"],
                            $teamId,
                            null,
                            null,
                            null,
                            $data["stats"][0]["value"]
                        ));
                    }
                }
            }
        }

        return $players;
    }

    protected function getUserAgents(): array
    {
        $userAgents = [
            "Mozilla/5.0 (Linux; Android 12; SM-S906N Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.119 Mobile Safari/537.36",
            "Mozilla/5.0 (Linux; Android 10; SM-G996U Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36",
            "Mozilla/5.0 (Linux; Android 9; SM-G973U Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36",
            "Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36",
            "Mozilla/5.0 (Linux; Android 7.0; SM-G930VC Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36",
            "Mozilla/5.0 (Linux; Android 10; Google Pixel 4 Build/QD1A.190821.014.C2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.108 Mobile Safari/537.36",
            "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 6P Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36",
            "Mozilla/5.0 (Linux; Android 9; J8110 Build/55.0.A.0.552; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/71.0.3578.99 Mobile Safari/537.36",
            "Mozilla/5.0 (Linux; Android 7.1.1; G8231 Build/41.2.A.0.219; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/59.0.3071.125 Mobile Safari/537.36",
            "Mozilla/5.0 (Linux; Android 6.0; HTC One M9 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.3",
            "Mozilla/5.0 (iPhone12,1; U; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/15E148 Safari/602.1",
            "Mozilla/5.0 (iPhone13,2; U; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/15E148 Safari/602.1",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/13.2b11866 Mobile/16A366 Safari/605.1.15",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/69.0.3497.105 Mobile/15E148 Safari/605.1",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A5370a Safari/604.1",
            "Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Microsoft; RM-1152) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Mobile Safari/537.36 Edge/15.15254",
            "Mozilla/5.0 (Linux; Android 11; Lenovo YT-J706X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
            "Mozilla/5.0 (Linux; Android 7.0; Pixel C Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36",
            "Mozilla/5.0 (Linux; Android 4.4.3; KFTHWI Build/KTU84M) AppleWebKit/537.36 (KHTML, like Gecko) Silk/47.1.79 like Chrome/47.0.2526.80 Safari/537.36",
            "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9",
            "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1",
        ];
        return $userAgents;
    }

    protected function fetchLatestGamesFrom365(int $competition365Id, $gamesToFixScorers, int $startedBeforeMins): Collection
    {
        $userAgents = $this->getUserAgents();

        $url = "https://webws.365scores.com/web/games/current/?appTypeId=5&langId=2&userCountryId=6&competitions=$competition365Id";

        $response = Http::withUserAgent(Arr::random($userAgents))->get($url);

        \Log::debug("[Crawler][fetchLatestGamesFrom365] Got response for request \"$url\"");

        $gamesData = null;
        if ($response->ok()) {
            $responseData = $response->json();
            $gamesData = $responseData["games"];
        } else {
            \Log::error("[Crawler][fetchLatestGamesFrom365] Got error for http request (status: " .$response->status() . ")");
            return collect([]);
        }

        $currentTimestamp = time();

        $maxStartTime = $currentTimestamp - $startedBeforeMins * 60;

        $relevantGames = collect();

        foreach ($gamesData as $game) {
            $startTimeTimestamp = strtotime($game['startTime']);

            if ($startTimeTimestamp >= $maxStartTime && $startTimeTimestamp <= $currentTimestamp) {
                $relevantGames->add($game);
            } else {
                foreach($gamesToFixScorers as $gameToFix){
                    if ($this->isGameDataMatchDbGame($game, $gameToFix)){
                        $relevantGames->add($game);
                    }
                }
            }
        }
        return $relevantGames;
    }


    protected function getScoresrsDataFromGame($gameData) {
        $gameId = $gameData->get("id");
        $events = collect($gameData->get("events"));
        $playerIdsMap = collect($gameData->get("members"))->keyBy('id')->map(fn($member) => $member["athleteId"]);
        
        
        $GOAL_EVENT_ID = 1; // constant
        $OWN_GOAL_SUB_TYPE_ID = 2; // constant
        $PENALTIES_STATUS_TYPE_ID = 11; // constant

        $playerStats = $events->reduce(function ($carry, $event) use ($GOAL_EVENT_ID, $OWN_GOAL_SUB_TYPE_ID, $PENALTIES_STATUS_TYPE_ID) {
            $playerId = $event['playerId'];
            $eventType = $event['eventType']['id'];
            if ($eventType == $GOAL_EVENT_ID && $event['eventType']['subTypeId'] != $OWN_GOAL_SUB_TYPE_ID && $event['statusId'] != $PENALTIES_STATUS_TYPE_ID) {
                if (!isset($carry[$playerId])){
                    $carry[$playerId] = collect();
                }
                $carry[$playerId]['goals'] = ($carry[$playerId]['goals'] ?? 0) + 1;
                if (isset($event['extraPlayers']) && count($event['extraPlayers']) > 0) {
                    $assistPlayerId = $event['extraPlayers'][0];
                    if (!isset($carry[$assistPlayerId])){
                        $carry[$assistPlayerId] = collect();
                    }
                    $carry[$assistPlayerId]['assists'] = ($carry[$assistPlayerId]['assists'] ?? 0) + 1;
                }
            }
            return $carry;
        }, collect([]));
    
        $result = collect($playerStats)->map(function ($stats, $playerId) use ($playerIdsMap, $gameId) {
            $playerIdOnDB = $playerIdsMap->get($playerId);
            $goals = $stats['goals'] ?? 0;
            $assists = $stats['assists'] ?? 0;
            \Log::debug("Got scorer data for game $gameId" . " -> player $playerIdOnDB: $goals goals, $assists assists");
            return [
                'playerOriginalId' => $playerIdOnDB,
                'goals' => $goals,
                'assists' => $assists,
            ];
        })->values()->keyBy("playerOriginalId");
    
        return $result;
    }

    protected function map365GameIdsToDbGames(Collection $dbGamesCollection, Collection $gamesFrom365) {
        $result = collect([]);
        foreach ($gamesFrom365 as $gameData){
            $matchingGameFromDb = $dbGamesCollection->first(fn ($dbGame) => $this->isGameDataMatchDbGame($gameData, $dbGame));
            if ($matchingGameFromDb){
                $dbGameId = $matchingGameFromDb["id"];
                $result[$gameData["id"]] = $dbGameId;
                $dbGamesCollection->forget($dbGameId);
                \Log::debug("[Crawler][map365GameIdsToDbGames]: mapping 365 gameId ".$gameData["id"]." to db gameId $dbGameId");
            } else {
                \Log::error("[Crawler][map365GameIdsToDbGames] could not find matching game for game ".$gameData["id"]."! \n dbGamesCollection: \n". $dbGamesCollection->toJson());
            }
        }
        return $result;
    }

    protected function isGameDataMatchDbGame($gameData, $dbGame){
        // Check if teams match (home or away)
        $dbTeams = collect([
            $this->translate365TeamId($dbGame["team_away_id"]),
            $this->translate365TeamId($dbGame["team_home_id"])
        ])->sort()->values()->toJson();
        $teamsFromGameData = collect([
            $gameData['homeCompetitor']['id'],
            $gameData['awayCompetitor']['id']
        ])->sort()->values()->toJson();
        \Log::debug("teamsFromGameData $teamsFromGameData");
        \Log::debug("dbTeams $dbTeams");
        if ($dbTeams != $teamsFromGameData){
            return false;
        }

        // Check if start times are within +- 2 hours for safety
        if (abs(strtotime($gameData['startTime']) - $dbGame['start_time']) >  60 * 60 * 2){
            return false;
        };

        return true;
    }

    /**
     * Overlay the live results/scores from 365scores onto the games parsed from football-data.
     * Mutates the given Game objects in place (results, started/done status & knockout winner).
     */
    protected function overlayScoresFrom365(Collection $parsedGames, int $competition365Id): void
    {
        $games365 = $this->fetchCurrentGamesFrom365($competition365Id);
        if ($games365->isEmpty()) {
            return;
        }

        // 365 game id => ['game' => CrawlerGame, 'homeIs365Home' => bool, 'game365' => array]
        $knockoutToDecompose = collect();

        /** @var Game $parsedGame */
        foreach ($parsedGames as $parsedGame) {
            $game365 = $this->match365GameToParsedGame($parsedGame, $games365);
            if (!$game365) {
                continue;
            }

            $statusGroup = data_get($game365, 'statusGroup');
            $home365Score = data_get($game365, 'homeCompetitor.score');
            $away365Score = data_get($game365, 'awayCompetitor.score');
            // Whether football-data's "home" team is 365's home competitor (365 can invert home/away).
            $homeIs365Home = $this->translate365TeamId($parsedGame->teamHomeExternalId) == data_get($game365, 'homeCompetitor.id');

            // statusGroup: 2 = scheduled, 3 = live, 4 = ended. A real score (>= 0) also means it kicked off.
            $parsedGame->isStarted = in_array($statusGroup, [3, 4], true) || ($home365Score >= 0 && $away365Score >= 0);
            $parsedGame->isDone = $statusGroup === 4;

            if (!$parsedGame->isStarted) {
                continue;
            }

            // Live minute: only while the game is in progress; cleared once it ends.
            $parsedGame->minute = $parsedGame->isDone ? null : $this->live365Minute($game365);

            if ($parsedGame->type === CompetitionGame::TYPE_KNOCKOUT) {
                $parsedGame->koWinnerExternalId = $this->resolve365KoWinner($parsedGame, $game365);
                // Knockout games can be decided in extra-time / penalties; the per-game detail
                // (same endpoint as scorers) is needed to split 90-min vs. extra-time vs. penalties.
                $knockoutToDecompose->put(data_get($game365, 'id'), [
                    'game' => $parsedGame,
                    'homeIs365Home' => $homeIs365Home,
                    'game365' => $game365,
                ]);
                continue;
            }

            // Group-stage game: a single regular-time score.
            [$home, $away] = $homeIs365Home ? [$home365Score, $away365Score] : [$away365Score, $home365Score];
            $parsedGame->resultHome = $this->toIntScore($home);
            $parsedGame->resultAway = $this->toIntScore($away);
            $parsedGame->fullResultHome = null;
            $parsedGame->fullResultAway = null;
            $parsedGame->totalResultHome = $this->toIntScore($home);
            $parsedGame->totalResultAway = $this->toIntScore($away);
        }

        if ($knockoutToDecompose->isNotEmpty()) {
            $this->overlayKnockoutResults($knockoutToDecompose);
        }
    }

    /**
     * Fetch the current games of a competition from 365scores (used as the source of results/scores).
     */
    protected function fetchCurrentGamesFrom365(int $competition365Id): Collection
    {
        $userAgents = $this->getUserAgents();
        $url = "https://webws.365scores.com/web/games/current/?appTypeId=5&langId=2&userCountryId=6&competitions=$competition365Id";

        $response = Http::withUserAgent(Arr::random($userAgents))->get($url);

        if (!$response->ok()) {
            \Log::error("[Crawler][fetchCurrentGamesFrom365] Got error for http request (status: " . $response->status() . ")");
            return collect([]);
        }

        return collect($response->json("games") ?? []);
    }

    /**
     * Find the 365scores game matching a football-data parsed game (by team pair + kick-off time).
     */
    protected function match365GameToParsedGame(Game $parsedGame, Collection $games365)
    {
        $parsedTeams = collect([
            $this->translate365TeamId($parsedGame->teamHomeExternalId),
            $this->translate365TeamId($parsedGame->teamAwayExternalId),
        ])->sort()->values()->toJson();

        return $games365->first(function ($game365) use ($parsedGame, $parsedTeams) {
            $teams365 = collect([
                data_get($game365, 'homeCompetitor.id'),
                data_get($game365, 'awayCompetitor.id'),
            ])->sort()->values()->toJson();

            if ($teams365 !== $parsedTeams) {
                return false;
            }

            // kick-off within +- 2 hours, for safety
            return abs(strtotime(data_get($game365, 'startTime')) - $parsedGame->startTime) <= 60 * 60 * 2;
        });
    }

    /**
     * Resolve the knockout winner (as a football-data team external id) from 365's isWinner flags.
     * 365's top-level "winner" field is unreliable, so the per-competitor isWinner flag is used.
     */
    protected function resolve365KoWinner(Game $parsedGame, $game365): ?int
    {
        $winner365Id = null;
        if (data_get($game365, 'homeCompetitor.isWinner')) {
            $winner365Id = data_get($game365, 'homeCompetitor.id');
        } elseif (data_get($game365, 'awayCompetitor.isWinner')) {
            $winner365Id = data_get($game365, 'awayCompetitor.id');
        }
        if ($winner365Id === null) {
            return null;
        }

        if ($this->translate365TeamId($parsedGame->teamHomeExternalId) == $winner365Id) {
            return (int) $parsedGame->teamHomeExternalId;
        }
        if ($this->translate365TeamId($parsedGame->teamAwayExternalId) == $winner365Id) {
            return (int) $parsedGame->teamAwayExternalId;
        }
        return null;
    }

    /**
     * For knockout games, fetch the per-game detail and split the result into 90-min / extra-time /
     * penalties using the 365 "stages" breakdown, mirroring the original football-data score logic:
     *   - resultHome/Away      = score after 90 minutes
     *   - fullResultHome/Away  = on-field score incl. extra-time, excl. shootout (null for regular time)
     *   - totalResultHome/Away = full result + penalty shootout
     */
    protected function overlayKnockoutResults(Collection $knockoutByGameId): void
    {
        $userAgents = $this->getUserAgents();
        $responses = Http::pool(function (Pool $pool) use ($knockoutByGameId, $userAgents) {
            return $knockoutByGameId->keys()->map(
                function ($gameId) use ($pool, $userAgents) {
                    $langId = rand(1, 50);
                    $baseUrl = "https://webws.365scores.com/web/game/?appTypeId=1&langId=$langId&userCountryId=6";
                    return $pool->as($gameId)->withUserAgent(Arr::random($userAgents))->get($baseUrl . "&gameId=$gameId");
                }
            )->toArray();
        });

        foreach ($responses as $gameId => $response) {
            $entry = $knockoutByGameId->get($gameId);
            if (!$entry || !($response instanceof Response)) {
                continue;
            }

            /** @var Game $parsedGame */
            $parsedGame = $entry['game'];
            $homeIs365Home = $entry['homeIs365Home'];

            $stages = collect($response->collect("game")->get("stages"));

            // 365 stage ids: 9 = End of 90 Minutes, 10 = End of Extra Time, 11 = Penalties,
            // 1 = Current (final on-field score, excluding the penalty shootout).
            $regular = $this->stageScore($stages, [9], ['90 min']);
            $current = $this->stageScore($stages, [1], ['current']);
            $extraTime = $this->stageScore($stages, [10], ['extra time']);
            $penalties = $this->stageScore($stages, [11], ['penalt']);

            // Fall back to the list score if the stages are not available yet.
            $fallback = [data_get($entry['game365'], 'homeCompetitor.score'), data_get($entry['game365'], 'awayCompetitor.score')];
            $final = $current ?? $regular ?? $fallback;     // on-field final (incl. ET, excl. shootout)
            $reg = $regular ?? $final;                        // score after 90 minutes
            // full_result_* must follow the live score while extra time is being played, but stay
            // null during regular-time play. $regular comes from the "End of 90 Minutes" stage,
            // which only has a real score once regulation is over (see stageScore) — so $regular
            // being non-null while the game is still live means it is in extra time. An ended game
            // that produced an Extra Time (10) or Penalties (11) stage also went the distance; an
            // ended game decided in 90 has neither, so full_result_* stays null for it.
            $wentToExtra = $extraTime !== null || $penalties !== null
                || (!$parsedGame->isDone && $regular !== null);

            // Re-orient 365 home/away to football-data home/away.
            [$regH, $regA] = $homeIs365Home ? [$reg[0], $reg[1]] : [$reg[1], $reg[0]];
            [$finH, $finA] = $homeIs365Home ? [$final[0], $final[1]] : [$final[1], $final[0]];
            $penH = $penalties ? ($homeIs365Home ? $penalties[0] : $penalties[1]) : 0;
            $penA = $penalties ? ($homeIs365Home ? $penalties[1] : $penalties[0]) : 0;

            $parsedGame->resultHome = $this->toIntScore($regH);
            $parsedGame->resultAway = $this->toIntScore($regA);
            $parsedGame->fullResultHome = $wentToExtra ? $this->toIntScore($finH) : null;
            $parsedGame->fullResultAway = $wentToExtra ? $this->toIntScore($finA) : null;
            $parsedGame->totalResultHome = $this->toIntScore($finH + $penH);
            $parsedGame->totalResultAway = $this->toIntScore($finA + $penA);
        }
    }

    /**
     * Return [homeScore, awayScore] of the first 365 "stage" matching one of the given ids or
     * whose name contains one of the given needles. Returns null if no such stage exists OR if it
     * exists but has not happened yet: a future stage (e.g. "End of 90 Minutes" before the 90
     * minutes are up) is always present in the array but carries a -1 score, which is treated here
     * as "no score yet".
     */
    protected function stageScore(Collection $stages, array $ids, array $nameNeedles): ?array
    {
        foreach ($stages as $stage) {
            $matches = in_array(data_get($stage, 'id'), $ids, true);
            $name = strtolower((string) data_get($stage, 'name'));
            foreach ($nameNeedles as $needle) {
                if ($name !== '' && str_contains($name, $needle)) {
                    $matches = true;
                }
            }
            if ($matches) {
                $home = data_get($stage, 'homeCompetitorScore');
                $away = data_get($stage, 'awayCompetitorScore');
                if ($home === null || $away === null || $home < 0 || $away < 0) {
                    return null;
                }
                return [$home, $away];
            }
        }
        return null;
    }

    /**
     * Normalise a 365 score (float, -1 when there is no score) to a nullable int.
     */
    protected function toIntScore($score): ?int
    {
        if ($score === null || $score < 0) {
            return null;
        }
        return (int) round($score);
    }

    /**
     * The live "minute" badge exactly as 365 shows it. 365 puts the running clock in
     * gameTimeDisplay ("87'", "45+2'" for stoppage, "120'"/"105'" for extra time) and
     * leaves it empty during breaks, where the state lives in shortStatusText ("HT",
     * "Pen."). Returns the running clock when present, else the status label, else null.
     * Callers only invoke this for live (started, not-done) games.
     */
    protected function live365Minute($game365): ?string
    {
        $display = trim((string) data_get($game365, 'gameTimeDisplay'));
        if ($display !== '') {
            return $display;
        }
        $label = trim((string) data_get($game365, 'shortStatusText'));
        return $label !== '' ? $label : null;
    }

    /* ------------------------------------------------------------------ */
    /* Test competitions: mock results derived from a past competition.   */
    /* Driven purely by the competition config (no network):              */
    /*   'test-competition'             => true                            */
    /*   'mock-update-from-competition' => <source competition id>         */
    /*   'current_game'                 => <index into sorted source games>*/
    /* The source competition is mapped to the test one by NAME.          */
    /* ------------------------------------------------------------------ */

    /**
     * Build the mock "crawler games" for a test competition, in the same shape
     * fetchGames() returns. Games before current_game are done (with the source
     * results), the game at current_game is live, later games have no result.
     *
     * @return Collection<Game>
     */
    public function fetchGamesFromConfig(\App\Competition $competition): Collection
    {
        [$source, $current] = $this->resolveMockConfig($competition);
        if (! $source) {
            return collect();
        }

        $sorted          = $this->sortedCompetitionGames($source);
        $indexBySourceId = $sorted->mapWithKeys(fn ($g, int $i) => [$g->id => $i])->all();
        $sourceNameById  = $source->teams->pluck('name', 'id');
        $sourceByKey     = $sorted->keyBy(fn ($g) => $this->mockGameKey($g, $sourceNameById));

        $testNameById    = $competition->teams->pluck('name', 'id');
        $testExtById     = $competition->teams->pluck('external_id', 'id');
        $testExtByName   = $competition->teams->pluck('external_id', 'name');

        $crawlerGames = collect();
        foreach ($competition->games as $testGame) {
            $src = $sourceByKey->get($this->mockGameKey($testGame, $testNameById));
            if (! $src) {
                \Log::warning("[Crawler][mock] no source game for test game {$testGame->id}");
                continue;
            }

            $index   = $indexBySourceId[$src->id];
            $started = $index <= $current;
            $done    = $index < $current;

            $koWinnerExtId = null;
            if ($done && $src->ko_winner) {
                $winnerName    = $sourceNameById[$src->ko_winner] ?? null;
                $koWinnerExtId = $winnerName !== null ? ($testExtByName[$winnerName] ?? null) : null;
            }

            $resultHome = $started ? $src->result_home : null;
            $resultAway = $started ? $src->result_away : null;

            $crawlerGames->put((string) $testGame->external_id, new Game(
                $testGame->external_id,
                $testGame->type,
                $testGame->sub_type,
                (string) $testExtById[$testGame->team_home_id],
                (string) $testExtById[$testGame->team_away_id],
                $testGame->start_time,
                $resultHome,
                $resultAway,
                $started ? $src->full_result_home : null,
                $started ? $src->full_result_away : null,
                $resultHome,
                $resultAway,
                $koWinnerExtId,
                $testGame->ko_leg,
                $done,
                $started,
            ));
        }

        return $crawlerGames->values();
    }

    /**
     * Mock scorers for a test competition, in the shape
     * UpdateCompetitionScorers::fake() expects: keyed by test game id, each a
     * collection keyed by player external_id => ['goals' => n, 'assists' => m].
     * Scorers are returned for every started game (index <= current_game).
     */
    public function fetchScorersFromConfig(\App\Competition $competition): Collection
    {
        [$source, $current] = $this->resolveMockConfig($competition);
        if (! $source) {
            return collect();
        }

        $sorted          = $this->sortedCompetitionGames($source);
        $indexBySourceId = $sorted->mapWithKeys(fn ($g, int $i) => [$g->id => $i])->all();
        $sourceNameById  = $source->teams->pluck('name', 'id');
        $sourceByKey     = $sorted->keyBy(fn ($g) => $this->mockGameKey($g, $sourceNameById));
        $testNameById    = $competition->teams->pluck('name', 'id');

        $sourcePlayerById = $source->players->keyBy('id');
        $sourceGoals      = \App\GameDataGoal::whereIn('game_id', $sorted->pluck('id'))->get()->groupBy('game_id');

        // test player external_id keyed by "<team name>##<player name>"
        $testExtByTeamAndName = collect();
        foreach ($competition->players as $tp) {
            $teamName = $testNameById[$tp->team_id] ?? '';
            $testExtByTeamAndName->put($teamName . '##' . $tp->name, $tp->external_id);
        }

        $result = collect();
        foreach ($competition->games as $testGame) {
            $src = $sourceByKey->get($this->mockGameKey($testGame, $testNameById));
            if (! $src || $indexBySourceId[$src->id] > $current) {
                continue; // not started yet -> no scorers
            }

            $perPlayer = collect();
            foreach ($sourceGoals->get($src->id, collect()) as $row) {
                $sp = $sourcePlayerById->get($row->player_id);
                if (! $sp) {
                    continue;
                }
                $teamName = $sourceNameById[$sp->team_id] ?? '';
                $extId    = $testExtByTeamAndName->get($teamName . '##' . $sp->name);
                if ($extId === null) {
                    \Log::warning("[Crawler][mock] no test player for source player {$sp->id} ({$sp->name})");
                    continue;
                }
                $perPlayer->put((string) $extId, ['goals' => $row->goals, 'assists' => $row->assists]);
            }

            $result->put($testGame->id, $perPlayer);
        }

        return $result;
    }

    /**
     * @return array{0: ?\App\Competition, 1: int} [source competition, current_game]
     */
    protected function resolveMockConfig(\App\Competition $competition): array
    {
        $config = (array) $competition->config;
        if (empty($config[\App\Testing\PastCompetitionTester::CONFIG_IS_TEST])) {
            return [null, 0];
        }

        $sourceId = $config[\App\Testing\PastCompetitionTester::CONFIG_SOURCE] ?? null;
        $current  = $config[\App\Testing\PastCompetitionTester::CONFIG_CURRENT_GAME] ?? null;
        if ($sourceId === null || $current === null) {
            return [null, 0];
        }

        $source = \App\Competition::with(['teams.players', 'games', 'players'])->find($sourceId);
        return [$source, (int) $current];
    }

    protected function sortedCompetitionGames(\App\Competition $competition): Collection
    {
        return $competition->games
            ->sort(fn ($a, $b) => [$a->start_time, $a->id] <=> [$b->start_time, $b->id])
            ->values();
    }

    protected function mockGameKey($game, Collection $teamNameById): string
    {
        $home = $teamNameById[$game->team_home_id] ?? '?';
        $away = $teamNameById[$game->team_away_id] ?? '?';
        $pair = collect([$home, $away])->sort()->values()->implode('::');

        return $pair . '|' . $game->sub_type . '|' . ($game->ko_leg ?? '');
    }

    /* ================================================================== */
    /* 365scores as the full source (matches/teams/standings).            */
    /* Used when Competition.config.source === '365'. Everything is in     */
    /* native 365 ids, so no translate365TeamId / football-data overlay.   */
    /* ================================================================== */

    /** Team list (+ group) from 365 standings. Shape matches CreateCompetition::saveTeams(). */
    public function fetchTeams365(?int $competition365Id): Collection
    {
        $rows = collect(data_get($this->fetch365Standings($competition365Id), 'standings.0.rows') ?? []);
        return $rows->map(fn ($row) => [
            'id'       => data_get($row, 'competitor.id'),
            'name'     => data_get($row, 'competitor.name'),
            'crestUrl' => $this->competitor365LogoUrl($row),
            'group_id' => $this->groupNum365ToGroupId(data_get($row, 'groupNum')),
        ])->filter(fn ($t) => $t['id'] !== null)->values();
    }

    /** Completed-group standings from 365. Shape matches the football-data fetchGroupStandings(). */
    public function fetchGroupStandings365(?int $competition365Id, int $totalGamesInGroup)
    {
        $rows = collect(data_get($this->fetch365Standings($competition365Id), 'standings.0.rows') ?? []);
        $res = [];
        foreach ($rows->groupBy('groupNum') as $groupNum => $groupRows) {
            // group complete only when every game has been played (sum of playedGames / 2).
            if ($groupRows->sum(fn ($r) => (int) data_get($r, 'gamePlayed')) / 2 != $totalGamesInGroup) {
                continue;
            }
            $standings = $groupRows
                ->sortBy(fn ($r) => data_get($r, 'position'))
                ->map(fn ($r) => [
                    'position'    => data_get($r, 'position'),
                    'team_ext_id' => data_get($r, 'competitor.id'),
                ])
                ->values();
            $res[$this->groupNum365ToGroupId($groupNum)] = $standings;
        }
        return $res;
    }

    /**
     * Current (live) per-team group standings from 365 — every group, regardless of completion.
     * Unlike fetchGroupStandings365() (final-only, position+id), this carries the full stat set used
     * by current_standings. Returns rows keyed by our Group external id ("GROUP_A"), each row:
     * { position, team_ext_id, game_played, points, goals_for, goals_against, goals_diff, is_eliminated }.
     */
    public function fetchCurrentGroupStandings365(?int $competition365Id)
    {
        $rows = collect(data_get($this->fetch365Standings($competition365Id), 'standings.0.rows') ?? []);
        $res = [];
        foreach ($rows->groupBy('groupNum') as $groupNum => $groupRows) {
            $groupId = $this->groupNum365ToGroupId($groupNum);
            if (is_null($groupId)) {
                continue; // not a group (e.g. pure knockout / league)
            }
            $standings = $groupRows
                ->map(function ($r) {
                    $goalsFor     = (int) data_get($r, 'for');
                    $goalsAgainst = (int) data_get($r, 'against');
                    return [
                        'position'      => (int) data_get($r, 'position'),
                        'team_ext_id'   => data_get($r, 'competitor.id'),
                        'game_played'   => (int) data_get($r, 'gamePlayed'),
                        'points'        => (int) data_get($r, 'points'),
                        'goals_for'     => $goalsFor,
                        'goals_against' => $goalsAgainst,
                        'goals_diff'    => $goalsFor - $goalsAgainst,
                        // 365: destinationNum 3 == elimination zone. destinationGuaranteed absent in
                        // non-tournament leagues, so default false → never eliminated without it.
                        'is_eliminated' => data_get($r, 'destinationGuaranteed') === true
                            && (int) data_get($r, 'destinationNum') === 3,
                    ];
                })
                ->filter(fn ($row) => $row['team_ext_id'] !== null)
                ->values();
            $res[$groupId] = $standings;
        }
        return $res;
    }

    /** Full fixture list from 365 (group + knockout), mapped to App\DataCrawler\Game. */
    public function fetchGames365(?int $competition365Id, $competitionType = Competition::TYPE_WC): Collection
    {
        if (is_null($competition365Id)) {
            return collect([]);
        }

        $stageSubTypeMap = $this->stage365SubTypeMap($competition365Id); // "stageNum:groupNum" => GameSubTypes
        $games365 = $this->fetchAll365Games($competition365Id);

        $parsed = collect();
        $knockoutToDecompose = collect();

        foreach ($games365 as $g) {
            $homeId = data_get($g, 'homeCompetitor.id');
            $awayId = data_get($g, 'awayCompetitor.id');
            if (is_null($homeId) || is_null($awayId)) {
                continue; // unfilled knockout slot
            }

            $groupName = data_get($g, 'groupName');
            $isGroup = $groupName && preg_match('/^\s*group/i', $groupName);

            if ($isGroup) {
                $type = "group_stage";
                $subType = self::transformGroupNameToGroupId($groupName);
            } else {
                $type = CompetitionGame::TYPE_KNOCKOUT;
                $subType = $stageSubTypeMap[data_get($g, 'stageNum') . ':' . data_get($g, 'groupNum')] ?? null;
                if (is_null($subType)) {
                    \Log::warning("[Crawler][fetchGames365] Could not classify KO game " . data_get($g, 'id') . " (stage " . data_get($g, 'stageNum') . " group " . data_get($g, 'groupNum') . ")");
                    continue;
                }
            }

            $startTimeRaw = data_get($g, 'startTime');
            $startTime = $startTimeRaw ? (strtotime($startTimeRaw) ?: null) : null;
            $statusGroup = data_get($g, 'statusGroup');
            $homeScore = data_get($g, 'homeCompetitor.score');
            $awayScore = data_get($g, 'awayCompetitor.score');
            $isStarted = in_array($statusGroup, [3, 4], true) || ($homeScore >= 0 && $awayScore >= 0);
            $isDone = $statusGroup === 4;

            $game = new Game(
                (string) data_get($g, 'id'),
                $type,
                $subType,
                (string) $homeId,
                (string) $awayId,
                $startTime,
                null, null, null, null, null, null, null, null,
                $isDone,
                $isStarted,
            );

            if ($isStarted) {
                // Live minute: only while the game is in progress; cleared once it ends.
                $game->minute = $isDone ? null : $this->live365Minute($g);
                if ($type === CompetitionGame::TYPE_KNOCKOUT) {
                    $game->koWinnerExternalId = $this->resolve365KoWinnerNative($g);
                    // 90'/ET/penalties split via the per-game detail (home is always 365 home here).
                    $knockoutToDecompose->put(data_get($g, 'id'), [
                        'game' => $game,
                        'homeIs365Home' => true,
                        'game365' => $g,
                    ]);
                } else {
                    $game->resultHome = $this->toIntScore($homeScore);
                    $game->resultAway = $this->toIntScore($awayScore);
                    $game->totalResultHome = $this->toIntScore($homeScore);
                    $game->totalResultAway = $this->toIntScore($awayScore);
                }
            }

            $parsed->put($game->externalId, $game);
        }

        if ($knockoutToDecompose->isNotEmpty()) {
            $this->overlayKnockoutResults($knockoutToDecompose);
        }

        // Two-leg ties (e.g. UCL): tag legs + compute aggregate winner — mirrors fetchGames().
        $twoLegsGames = $parsed->filter(fn (Game $game) => $this->isTwoLegedTie($game, $competitionType));
        $groupedByLegs = $twoLegsGames->groupBy(fn (Game $game) => $this->gameToLegsId($game))->map(
            fn (Collection|Game $games) => $games->sortBy('startTime')->map(fn ($g) => $g->externalId)
        );
        foreach ($groupedByLegs as $gamesIdOrdered) {
            if (count($gamesIdOrdered) < 2) {
                continue;
            }
            $firstLegGame = $parsed[$gamesIdOrdered[0]];
            $secondLegGame = $parsed[$gamesIdOrdered[1]];
            $parsed[$firstLegGame->externalId]->koLeg = CompetitionGame::LEG_TYPE_FIRST;
            $parsed[$secondLegGame->externalId]->koLeg = CompetitionGame::LEG_TYPE_SECOND;
            $parsed[$secondLegGame->externalId]->koWinnerExternalId = $this->calcSecondLegKoWinnerExternalId($secondLegGame, $firstLegGame);
        }

        return $parsed->values();
    }

    /** Build a "stageNum:groupNum" => GameSubTypes map from the 365 bracket (precise per tie). */
    protected function stage365SubTypeMap(?int $competition365Id): array
    {
        $bracket = $this->fetchBracket($competition365Id);
        if (!$bracket) {
            return [];
        }
        $map = [];
        foreach ($bracket->ties as $tie) {
            $map[$tie->stageNum . ':' . $tie->groupNum] = $tie->subType;
        }
        return $map;
    }

    /** Walk both 365 paging cursors (results backward + fixtures forward) to collect every game once. */
    protected function fetchAll365Games(int $competition365Id): Collection
    {
        $q = "appTypeId=5&langId=1&timezoneName=Asia/Jerusalem&userCountryId=6&competitions={$competition365Id}";
        $byId = collect();
        // "current" seeds the live/around-now window; results walks back, fixtures walks forward.
        foreach (["current", "results", "fixtures"] as $kind) {
            $start = "https://webws.365scores.com/web/games/{$kind}/?{$q}";
            $this->walk365GamePages($start, 'previousPage', $byId);
            $this->walk365GamePages($start, 'nextPage', $byId);
        }
        return $byId->values();
    }

    protected function walk365GamePages(string $url, string $pageKey, Collection $byId): void
    {
        $userAgents = $this->getUserAgents();
        for ($i = 0; $i < 50 && $url; $i++) {
            $response = Http::withUserAgent(Arr::random($userAgents))->get($url);
            if (!$response->ok()) {
                break;
            }
            $json = $response->json();
            $games = data_get($json, 'games') ?? [];
            $added = 0;
            foreach ($games as $g) {
                $id = data_get($g, 'id');
                if ($id !== null && !$byId->has($id)) {
                    $byId->put($id, $g);
                    $added++;
                }
            }
            $next = data_get($json, "paging.{$pageKey}");
            if (!$next || $added === 0) {
                break; // no further pages / no progress (avoids cursor loops)
            }
            $url = str_starts_with($next, 'http') ? $next : ("https://webws.365scores.com" . $next);
        }
    }

    /** Knockout winner as a (native 365) team id, from the 365 isWinner flag. */
    protected function resolve365KoWinnerNative($game365): ?int
    {
        if (data_get($game365, 'homeCompetitor.isWinner')) {
            return (int) data_get($game365, 'homeCompetitor.id');
        }
        if (data_get($game365, 'awayCompetitor.isWinner')) {
            return (int) data_get($game365, 'awayCompetitor.id');
        }
        return null;
    }

    protected function fetch365Standings(?int $competition365Id): array
    {
        if (is_null($competition365Id)) {
            return [];
        }
        $userAgents = $this->getUserAgents();
        $url = "https://webws.365scores.com/web/standings/?appTypeId=5&langId=1&timezoneName=Asia/Jerusalem&userCountryId=6&competitions={$competition365Id}&live=false";
        $response = Http::withUserAgent(Arr::random($userAgents))->get($url);
        if (!$response->ok()) {
            \Log::error("[Crawler][fetch365Standings] Got error for http request (status: " . $response->status() . ")");
            return [];
        }
        return $response->json() ?? [];
    }

    /** "GROUP_A" from 365 groupNum (1 => A). Null/0 => null (no group, e.g. pure knockout). */
    protected function groupNum365ToGroupId($groupNum): ?string
    {
        $groupNum = (int) $groupNum;
        if ($groupNum < 1) {
            return null;
        }
        return "GROUP_" . chr(ord('A') + $groupNum - 1);
    }

    protected function competitor365LogoUrl($row): ?string
    {
        $id = data_get($row, 'competitor.id');
        if (is_null($id)) {
            return null;
        }
        $version = data_get($row, 'competitor.imageVersion', 1);
        return "https://imagecache.365scores.com/image/upload/f_png,w_68,h_68,c_limit,q_auto:eda,dpr_2/v{$version}/Competitors/{$id}";
    }

    /**
     * Fetch the knockout bracket topology from 365scores. Returns the full tree (ties, who-feeds-whom,
     * first-round group/position slots) as a pure DTO. Available before the draw (placeholder
     * participants) and progressively enriched (real teams, game ids) as the competition runs.
     */
    public function fetchBracket(?int $competition365Id): ?Bracket
    {
        if (is_null($competition365Id)) {
            return null;
        }

        $userAgents = $this->getUserAgents();
        $url = "https://webws.365scores.com/web/brackets/?appTypeId=5&langId=1&timezoneName=Asia/Jerusalem&userCountryId=6&competitions={$competition365Id}&live=false&topBookmaker=1";

        $response = Http::withUserAgent(Arr::random($userAgents))->get($url);
        if (!$response->ok()) {
            \Log::error("[Crawler][fetchBracket] Got error for http request (status: " . $response->status() . ")");
            return null;
        }

        $stages = collect(data_get($response->json(), 'brackets.0.stages') ?? []);
        if ($stages->isEmpty()) {
            return null;
        }

        // The group stage (stageType 2): map its 365 group num -> our group external id ("GROUP_A").
        $groupStage = $stages->first(fn ($s) => data_get($s, 'stageType') === self::BRACKET_STAGE_TYPE_GROUP);
        $groupStageNum = $groupStage ? (int) data_get($groupStage, 'num') : null;
        $groupExtIdByNum = collect(data_get($groupStage, 'groups') ?? [])
            ->mapWithKeys(fn ($g) => [(int) data_get($g, 'num') => self::transformGroupNameToGroupId(data_get($g, 'name'))]);

        $ties = [];
        foreach ($stages as $stage) {
            if (data_get($stage, 'stageType') !== self::BRACKET_STAGE_TYPE_KNOCKOUT) {
                continue;
            }
            $stageNum = (int) data_get($stage, 'num');
            foreach (data_get($stage, 'groups') ?? [] as $group) {
                $participants = collect(data_get($group, 'participants') ?? []);
                if ($participants->count() < 2) {
                    continue; // not a playable tie (defensive)
                }

                $subType = $this->bracketSubType($stage, $group);
                $game365 = collect(data_get($group, 'games') ?? [])->first();
                $start = data_get($game365, 'startTime');

                $home = $this->parseBracketParticipant(
                    $participants->firstWhere('num', 1) ?? $participants[0],
                    $groupStageNum,
                    $groupExtIdByNum
                );
                $away = $this->parseBracketParticipant(
                    $participants->firstWhere('num', 2) ?? $participants[1],
                    $groupStageNum,
                    $groupExtIdByNum
                );

                $ties[] = new BracketTie(
                    $stageNum,
                    (int) data_get($group, 'num'),
                    $subType,
                    data_get($group, 'name'),
                    $start ? strtotime($start) : null,
                    data_get($game365, 'id') !== null ? (string) data_get($game365, 'id') : null,
                    $home,
                    $away,
                    data_get($group, 'destStageNum') !== null ? (int) data_get($group, 'destStageNum') : null,
                    data_get($group, 'destGroupNum') !== null ? (int) data_get($group, 'destGroupNum') : null,
                );
            }
        }

        return new Bracket($ties);
    }

    private const BRACKET_STAGE_TYPE_GROUP    = 2;
    private const BRACKET_STAGE_TYPE_KNOCKOUT = 3;

    /** Map a 365 knockout stage/tie to a GameSubTypes value. */
    private function bracketSubType(array $stage, array $group): string
    {
        // The Final stage holds both the Final and the 3rd-place playoff.
        if (data_get($stage, 'isFinal')) {
            $name = strtolower((string) data_get($group, 'name'));
            $symbolic = strtoupper((string) data_get($group, 'participants.0.symbolicName'));
            if (str_contains($name, '3rd') || str_contains($name, 'third') || str_starts_with($symbolic, 'L')) {
                return GameSubTypes::THIRD_PLACE;
            }
            return GameSubTypes::FINAL;
        }

        return match (strtolower(trim((string) data_get($stage, 'name')))) {
            'round of 32'   => GameSubTypes::LAST_32,
            'round of 16'   => GameSubTypes::LAST_16,
            'quarter finals', 'quarter-finals', 'quarterfinals' => GameSubTypes::QUARTER_FINALS,
            'semi finals', 'semi-finals', 'semifinals'          => GameSubTypes::SEMI_FINALS,
            'final'         => GameSubTypes::FINAL,
            default         => (string) data_get($stage, 'name'),
        };
    }

    /** Parse one 365 bracket participant into a source DTO. */
    private function parseBracketParticipant($participant, ?int $groupStageNum, Collection $groupExtIdByNum): BracketSource
    {
        $slotNum       = (int) data_get($participant, 'num');
        $originStage   = data_get($participant, 'originStageNum');
        $originGroup   = data_get($participant, 'originGroupNum');
        $originPos     = data_get($participant, 'originPosition');
        $symbolic      = data_get($participant, 'symbolicName');
        $name          = (string) data_get($participant, 'name');
        // brackets participants carry a flat competitorId; fall back to the nested competitor.id shape.
        $team365Id     = data_get($participant, 'competitorId') ?? data_get($participant, 'competitor.id');

        $isFromGroupStage = $groupStageNum !== null && (int) $originStage === $groupStageNum;

        if ($isFromGroupStage) {
            $kind = BracketSource::KIND_GROUP_POSITION;
        } elseif (str_starts_with(strtoupper((string) $symbolic), 'L')) {
            $kind = BracketSource::KIND_MATCH_LOSER;
        } elseif (str_starts_with(strtoupper((string) $symbolic), 'W')) {
            $kind = BracketSource::KIND_MATCH_WINNER;
        } else {
            $kind = ((int) $originPos === 1) ? BracketSource::KIND_MATCH_WINNER : BracketSource::KIND_MATCH_LOSER;
        }

        // Resolve the slot's group + rank from its label. A first-round group-position slot is labelled
        // "<rank> <group>" — "1st B" (1st of group B), "2nd A", "3rd". The leading ordinal is the
        // group-stage rank (origin_position); the trailing letter is the group. The label is
        // authoritative: 365's originGroupNum is a tie index within the stage, not the group letter.
        $position      = $originPos !== null ? (int) $originPos : null;
        $allowedGroups = null;
        $groupExtId    = null;

        if ($kind === BracketSource::KIND_GROUP_POSITION) {
            [$labelPos, $groupLetter, $labelAllowed] = $this->parseGroupSlotLabel($name);
            // The rank must come from the label — we don't trust 365's originPosition here. But once the
            // team is already resolved (competitor id present) the group/rank source is moot, so allow
            // them to stay empty; only fail loud when we have neither a team nor a parseable rank.
            if ($labelPos === null && $team365Id === null) {
                throw new \RuntimeException(
                    "[Crawler] Could not parse group-stage rank from bracket slot label: \"{$name}\""
                );
            }
            $position = $labelPos;
            $allowedGroups = $labelAllowed;

            // 3rd place qualifies from an as-yet-unknown group, so never pin it to a concrete group
            // ("3rd place from an unknown group"). 1st/2nd pin to the group named in the label, falling
            // back to 365's origin-group mapping when the label carries no letter.
            if ($position !== 3) {
                if ($groupLetter !== null) {
                    $groupExtId = self::transformGroupNameToGroupId('Group ' . $groupLetter);
                } elseif ($originGroup !== null) {
                    $groupExtId = $groupExtIdByNum->get((int) $originGroup);
                }
            }
        } elseif (strtoupper((string) $symbolic) === '3RD') {
            // symbolic 3rd-place slot that isn't tied to a parsed group-stage origin.
            $letters = preg_replace('/^\s*3\s*RD/i', '', strtoupper($name));
            preg_match_all('/[A-Z]/', $letters, $m);
            $allowedGroups = $m[0] ? implode('', $m[0]) : null;
        }

        return new BracketSource(
            $slotNum,
            $kind,
            $originStage !== null ? (int) $originStage : null,
            $originGroup !== null ? (int) $originGroup : null,
            $position,
            $symbolic !== null ? (string) $symbolic : null,
            $allowedGroups,
            $groupExtId,
            $team365Id !== null ? (int) $team365Id : null,
        );
    }

    /**
     * Parse a first-round group-position label into [position, groupLetter, allowedGroups].
     *  - "1st B"        -> [1, "B", null]
     *  - "2nd A"        -> [2, "A", null]
     *  - "3rd"          -> [3, null, null]      (3rd place — unknown group)
     *  - "3rd A/B/C/D"  -> [3, null, "ABCD"]    (3rd place — one of these groups)
     */
    private function parseGroupSlotLabel(string $name): array
    {
        $upper = strtoupper(trim($name));
        preg_match('/(\d+)/', $upper, $pm);
        $position = isset($pm[1]) ? (int) $pm[1] : null;

        // letters left after stripping the leading ordinal ("1ST"/"2ND"/"3RD"/"4TH"...).
        $rest = preg_replace('/^\s*\d+\s*(ST|ND|RD|TH)?/', '', $upper);
        preg_match_all('/[A-Z]/', $rest, $lm);
        $letters = $lm[0] ?? [];

        if ($position === 3) {
            return [$position, null, $letters ? implode('', $letters) : null];
        }
        return [$position, $letters[0] ?? null, null];
    }

}