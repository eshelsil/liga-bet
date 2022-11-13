<?php
/**
 * Created by PhpStorm.
 * User: michael
 * Date: 16/06/18
 * Time: 14:26
 */

namespace App\DataCrawler;

use Illuminate\Http\Client\Pool;
use Illuminate\Http\Client\Response;
use \Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;

class Crawler
{

    protected string $id;

    public function __construct(string $id)
    {
        $this->id = $id;
    }

    public static function getInstance($id = "ec") {
        return new static($id);
    }

    private static function parse_match($match_json)
    {
        $start_time =  \DateTime::createFromFormat(\DateTime::ISO8601, data_get($match_json, 'utcDate'));
        $type = data_get($match_json, 'stage') == "GROUP_STAGE" ? "group_stage" : "knockout";
        $home_team_id = data_get($match_json, 'homeTeam.id');
        $away_team_id = data_get($match_json, 'awayTeam.id');
        if (is_null($home_team_id) || is_null($away_team_id)){
            return null;
        }

        $is_done = data_get($match_json, 'status') == "FINISHED";
        $winner_side = data_get($match_json, 'score.winner');

        $ko_winner = null;
        if ($type === "knockout"){
            if ($winner_side === "HOME_TEAM"){
                $ko_winner = $home_team_id;
            }
            if ($winner_side === "AWAY_TEAM"){
                $ko_winner = $away_team_id;
            }
        }

        $result_home = null;
        $result_away = null;
        if ($is_done){
            $result_home_ft = data_get($match_json, 'score.fullTime.homeTeam');
            $result_away_ft = data_get($match_json, 'score.fullTime.awayTeam');
            $result_home_et = data_get($match_json, 'score.extraTime.homeTeam');
            $result_away_et = data_get($match_json, 'score.extraTime.awayTeam');
            $result_home_penalties = data_get($match_json, 'score.penalties.homeTeam');
            $result_away_penalties = data_get($match_json, 'score.penalties.awayTeam');
            $duration = data_get($match_json, 'score.duration');
            if ($duration === 'REGULAR'){
                $result_home = $result_home_ft;
                $result_away = $result_away_ft;
            } else if ($duration === 'EXTRA_TIME'){
                $result_home = $result_home_ft - $result_home_et;
                $result_away = $result_away_ft - $result_away_et;
            } else if ($duration === 'PENALTY_SHOOTOUT'){
                $result_home = $result_home_ft - $result_home_et - $result_home_penalties;
                $result_away = $result_away_ft - $result_away_et - $result_away_penalties;
            } else {
                throw new \Exception("Cannot parse score from match due to unrecognised 'duration' value: [${$duration}]");
            }
        }

        return [
            'external_id' => data_get($match_json, 'id'),
            'type' => $type,
            'sub_type' => $type == "group_stage" ? data_get($match_json, 'group') : data_get($match_json, 'stage'),
            'team_home_external_id' => $home_team_id,
            'team_away_external_id' => $away_team_id,
            'start_time' => $start_time ? $start_time->format("U") : null,
            'result_home'  => $result_home,
            'result_away'  => $result_away,
            'is_done' => $is_done,
            'ko_winner_external_id' => $ko_winner
        ];
    }

    private function apiCall($additional_path, $addCompetitionPrefix = true)
    {
        $api_token = config('api.api_token'); // TODO: Rotate

        $url = config('api.path');
        if ($addCompetitionPrefix) {
            $url .= "competitions/" . $this->id;
        }
        $url .= "/". $additional_path;
        $headers = ['X-Auth-Token' => $api_token];
        $res = Http::withHeaders($headers)->get($url);

        $res->throw();

        return $res->json();
    }

    public function fetchTeams(): Collection
    {
        $data = $this->apiCall('/standings');
        $standings = data_get($data, 'standings');

        $groups = collect($standings)->where('type', 'TOTAL');
        $teams = [];
        foreach ($groups as $group){
            $group_id = data_get($group, 'group');
            $group_teams = data_get($group, 'table.*.team');
            $teams = array_merge($teams, array_map(function($t) use($group_id){
                return array_merge(['group_id' => $group_id], $t);
            }, $group_teams));
        }
        return collect($teams);
    }

    public function fetchGames()
    {
        $data = $this->apiCall('/matches');
        $matches = data_get($data, 'matches');

        return collect($matches)->map(function($m){
            return self::parse_match($m);
        })->filter(function($m){
            return !is_null($m);
        });
    }

    public function fetchScorers(Collection $teamIds): Collection
    {
        return $this->fetchScorers365($teamIds);

        $data = $this->apiCall('/scorers?limit=300');
        $scorers = $data;

        return collect($scorers);
    }

    public function fetchPlayersByTeamId($teamId)//450
    {
        return $this->fetchPlayersByTeamId365score($teamId);

        return collect(
            $this->apiCall("/teams/{$teamId}?limit=300", false)["squad"]
        )->map(fn($data) => new Player($data["id"], $data["name"], $teamId, $data["shirtNumber"], $data["position"]));
    }

    public function fetchGroupStandings()
    {    
        $data = $this->apiCall('/standings');
        $standings = data_get($data, 'standings');
        $groups = collect($standings)->where('type', 'TOTAL');
        $done_groups = $groups->filter(function($group){
            # verifying 6 games were played in a group:
            return array_sum( data_get($group, "table.*.playedGames") ) / 2 == 6;
        });
        $res = [];
        foreach($done_groups as $group_data){
            $table = data_get($group_data, 'table');
            $group_id = data_get($group_data, 'group');
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
            ->filter(fn($data) => $data["formationPosition"]["name"] != "מאמן")
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
        };
    }

    /**
     * @param Collection $teamIds
     *
     * @return Collection
     */
    protected function fetchScorers365(Collection $teamIds): Collection
    {
        $baseUrl = "https://webws.365scores.com/web/stats/?appTypeId=5&langId=2&timezoneName=Asia/Jerusalem&userCountryId=6&competition=5421"; // 5930
        $responses = Http::pool(function (Pool $pool) use ($teamIds, $baseUrl) {
            return $teamIds->map(
                fn($teamId) => $pool->as($teamId)->get($baseUrl . "&competitor=" . self::translate365TeamId($teamId))
            )->toArray();
        });

        $players = collect();

        /** @var Response $response */
        foreach ($responses as $teamId => $response) {
            $response->collect("stats.0.rows")
                     ->each(fn($data) => $players->add(new Player(
                         $data["entity"]["id"],
                         $data["entity"]["name"],
                         $teamId,
                         null,
                         null,
                         $data["stats"][0]["value"]
                     )));

            foreach ($response->collect("stats.1.rows") as $data) {
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

        return $players;
    }

}