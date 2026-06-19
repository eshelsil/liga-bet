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
use Illuminate\Http\Client\Pool;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Arr;
use \Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Log;

class Crawler
{

    protected string $id;

    public function __construct(string $id)
    {
        $this->id = $id;
    }

    public static function getInstance($id = "wc") {
        return new static($id);
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
        if (app()->environment("testing")) {
            $data = json_decode('{"count":64,"filters":{},"competition":{"id":2000,"area":{"id":2267,"name":"World"},"name":"FIFA World Cup","code":"WC","plan":"TIER_ONE","lastUpdated":"2022-05-09T19:45:29Z"},"matches":[{"id":391882,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-20T16:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_A","lastUpdated":"2022-11-14T01:32:00Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":8030,"name":"Qatar"},"awayTeam":{"id":791,"name":"Ecuador"},"referees":[]},{"id":391887,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-21T13:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_B","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":770,"name":"England"},"awayTeam":{"id":840,"name":"Iran"},"referees":[]},{"id":391881,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-21T16:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_A","lastUpdated":"2022-11-15T01:32:00Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":804,"name":"Senegal"},"awayTeam":{"id":8601,"name":"Netherlands"},"referees":[]},{"id":391888,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-21T19:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_B","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":771,"name":"United States"},"awayTeam":{"id":833,"name":"Wales"},"referees":[]},{"id":391893,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-22T10:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_C","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":762,"name":"Argentina"},"awayTeam":{"id":801,"name":"Saudi Arabia"},"referees":[]},{"id":391899,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-22T13:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_D","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":782,"name":"Denmark"},"awayTeam":{"id":802,"name":"Tunisia"},"referees":[]},{"id":391894,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-22T16:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_C","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":769,"name":"Mexico"},"awayTeam":{"id":794,"name":"Poland"},"referees":[]},{"id":391900,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-22T19:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_D","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":773,"name":"France"},"awayTeam":{"id":779,"name":"Australia"},"referees":[]},{"id":391911,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-23T10:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_F","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":815,"name":"Morocco"},"awayTeam":{"id":799,"name":"Croatia"},"referees":[]},{"id":391905,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-23T13:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_E","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":759,"name":"Germany"},"awayTeam":{"id":766,"name":"Japan"},"referees":[]},{"id":391906,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-23T16:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_E","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":760,"name":"Spain"},"awayTeam":{"id":793,"name":"Costa Rica"},"referees":[]},{"id":391912,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-23T19:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_F","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":805,"name":"Belgium"},"awayTeam":{"id":828,"name":"Canada"},"referees":[]},{"id":391917,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-24T10:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_G","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":788,"name":"Switzerland"},"awayTeam":{"id":781,"name":"Cameroon"},"referees":[]},{"id":391923,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-24T13:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_H","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":758,"name":"Uruguay"},"awayTeam":{"id":772,"name":"South Korea"},"referees":[]},{"id":391924,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-24T16:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_H","lastUpdated":"2022-08-12T13:10:40Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":765,"name":"Portugal"},"awayTeam":{"id":763,"name":"Ghana"},"referees":[]},{"id":391918,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-24T19:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_G","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":764,"name":"Brazil"},"awayTeam":{"id":780,"name":"Serbia"},"referees":[]},{"id":391889,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-25T10:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_B","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":833,"name":"Wales"},"awayTeam":{"id":840,"name":"Iran"},"referees":[]},{"id":391883,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-25T13:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_A","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":8030,"name":"Qatar"},"awayTeam":{"id":804,"name":"Senegal"},"referees":[]},{"id":391884,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-25T16:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_A","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":8601,"name":"Netherlands"},"awayTeam":{"id":791,"name":"Ecuador"},"referees":[]},{"id":391890,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-25T19:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_B","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":770,"name":"England"},"awayTeam":{"id":771,"name":"United States"},"referees":[]},{"id":391901,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-26T10:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_D","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":802,"name":"Tunisia"},"awayTeam":{"id":779,"name":"Australia"},"referees":[]},{"id":391895,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-26T13:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_C","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":794,"name":"Poland"},"awayTeam":{"id":801,"name":"Saudi Arabia"},"referees":[]},{"id":391902,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-26T16:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_D","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":773,"name":"France"},"awayTeam":{"id":782,"name":"Denmark"},"referees":[]},{"id":391896,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-26T19:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_C","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":762,"name":"Argentina"},"awayTeam":{"id":769,"name":"Mexico"},"referees":[]},{"id":391907,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-27T10:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_E","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":766,"name":"Japan"},"awayTeam":{"id":793,"name":"Costa Rica"},"referees":[]},{"id":391913,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-27T13:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_F","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":805,"name":"Belgium"},"awayTeam":{"id":815,"name":"Morocco"},"referees":[]},{"id":391914,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-27T16:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_F","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":799,"name":"Croatia"},"awayTeam":{"id":828,"name":"Canada"},"referees":[]},{"id":391908,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-27T19:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_E","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":760,"name":"Spain"},"awayTeam":{"id":759,"name":"Germany"},"referees":[]},{"id":391919,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-28T10:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_G","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":781,"name":"Cameroon"},"awayTeam":{"id":780,"name":"Serbia"},"referees":[]},{"id":391925,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-28T13:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_H","lastUpdated":"2022-08-12T13:10:40Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":772,"name":"South Korea"},"awayTeam":{"id":763,"name":"Ghana"},"referees":[]},{"id":391920,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-28T16:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_G","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":764,"name":"Brazil"},"awayTeam":{"id":788,"name":"Switzerland"},"referees":[]},{"id":391926,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-28T19:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_H","lastUpdated":"2022-08-12T13:10:40Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":765,"name":"Portugal"},"awayTeam":{"id":758,"name":"Uruguay"},"referees":[]},{"id":391885,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-29T15:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_A","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":8601,"name":"Netherlands"},"awayTeam":{"id":8030,"name":"Qatar"},"referees":[]},{"id":391886,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-29T15:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_A","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":791,"name":"Ecuador"},"awayTeam":{"id":804,"name":"Senegal"},"referees":[]},{"id":391891,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-29T19:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_B","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":833,"name":"Wales"},"awayTeam":{"id":770,"name":"England"},"referees":[]},{"id":391892,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-29T19:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_B","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":840,"name":"Iran"},"awayTeam":{"id":771,"name":"United States"},"referees":[]},{"id":391903,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-30T15:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_D","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":802,"name":"Tunisia"},"awayTeam":{"id":773,"name":"France"},"referees":[]},{"id":391904,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-30T15:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_D","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":779,"name":"Australia"},"awayTeam":{"id":782,"name":"Denmark"},"referees":[]},{"id":391897,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-30T19:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_C","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":794,"name":"Poland"},"awayTeam":{"id":762,"name":"Argentina"},"referees":[]},{"id":391898,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-30T19:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_C","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":801,"name":"Saudi Arabia"},"awayTeam":{"id":769,"name":"Mexico"},"referees":[]},{"id":391915,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-01T15:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_F","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":799,"name":"Croatia"},"awayTeam":{"id":805,"name":"Belgium"},"referees":[]},{"id":391916,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-01T15:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_F","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":828,"name":"Canada"},"awayTeam":{"id":815,"name":"Morocco"},"referees":[]},{"id":391909,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-01T19:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_E","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":766,"name":"Japan"},"awayTeam":{"id":760,"name":"Spain"},"referees":[]},{"id":391910,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-01T19:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_E","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":793,"name":"Costa Rica"},"awayTeam":{"id":759,"name":"Germany"},"referees":[]},{"id":391927,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-02T15:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_H","lastUpdated":"2022-08-12T13:10:40Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":772,"name":"South Korea"},"awayTeam":{"id":765,"name":"Portugal"},"referees":[]},{"id":391928,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-02T15:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_H","lastUpdated":"2022-08-12T13:10:40Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":763,"name":"Ghana"},"awayTeam":{"id":758,"name":"Uruguay"},"referees":[]},{"id":391921,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-02T19:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_G","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":781,"name":"Cameroon"},"awayTeam":{"id":764,"name":"Brazil"},"referees":[]},{"id":391922,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-02T19:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_G","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":780,"name":"Serbia"},"awayTeam":{"id":788,"name":"Switzerland"},"referees":[]},{"id":391929,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-03T15:00:00Z","status":"SCHEDULED","matchday":null,"stage":"LAST_16","group":null,"lastUpdated":"2022-05-17T19:37:03Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391930,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-03T19:00:00Z","status":"SCHEDULED","matchday":null,"stage":"LAST_16","group":null,"lastUpdated":"2022-05-17T19:37:03Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391931,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-04T15:00:00Z","status":"SCHEDULED","matchday":null,"stage":"LAST_16","group":null,"lastUpdated":"2022-05-17T19:37:03Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391932,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-04T19:00:00Z","status":"SCHEDULED","matchday":null,"stage":"LAST_16","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391933,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-05T15:00:00Z","status":"SCHEDULED","matchday":null,"stage":"LAST_16","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391934,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-05T19:00:00Z","status":"SCHEDULED","matchday":null,"stage":"LAST_16","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391935,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-06T15:00:00Z","status":"SCHEDULED","matchday":null,"stage":"LAST_16","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391936,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-06T19:00:00Z","status":"SCHEDULED","matchday":null,"stage":"LAST_16","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391937,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-09T15:00:00Z","status":"SCHEDULED","matchday":null,"stage":"QUARTER_FINALS","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391938,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-09T19:00:00Z","status":"SCHEDULED","matchday":null,"stage":"QUARTER_FINALS","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391939,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-10T15:00:00Z","status":"SCHEDULED","matchday":null,"stage":"QUARTER_FINALS","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391940,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-10T19:00:00Z","status":"SCHEDULED","matchday":null,"stage":"QUARTER_FINALS","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391941,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-13T19:00:00Z","status":"SCHEDULED","matchday":null,"stage":"SEMI_FINALS","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391942,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-14T19:00:00Z","status":"SCHEDULED","matchday":null,"stage":"SEMI_FINALS","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391943,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-17T15:00:00Z","status":"SCHEDULED","matchday":null,"stage":"THIRD_PLACE","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391944,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-18T15:00:00Z","status":"SCHEDULED","matchday":null,"stage":"FINAL","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]}]}', true);
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

        \Log::debug("[Crawler][fetchLatestGamesFrom365] Got response for request \"$url\" |\n Body: \n ".$response->body());

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
            $wentToExtra = $extraTime !== null || $penalties !== null
                || ($reg[0] != $final[0] || $reg[1] != $final[1]);

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
     * whose name contains one of the given needles; null if no such stage exists.
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
                return [data_get($stage, 'homeCompetitorScore'), data_get($stage, 'awayCompetitorScore')];
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

}