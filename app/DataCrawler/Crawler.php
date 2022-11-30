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

    public static function getInstance($id = "ec") {
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

        $isDone = data_get($match_json, 'status') == "FINISHED";
        $isStarted = in_array(data_get($match_json, 'status'), [
            "IN_PLAY", "PAUSED", "EXTRA_TIME", "PENALTY_SHOOTOUT", "FINISHED",
            "SUSPENDED", "POSTPONED", "CANCELLED", "AWARDED"
        ]);
        $winner_side = data_get($match_json, 'score.winner');

        $koWinner = null;
        if ($type === "knockout") {
            if ($winner_side === "HOME_TEAM") {
                $koWinner = $homeTeamId;
            }
            if ($winner_side === "AWAY_TEAM") {
                $koWinner = $awayTeamId;
            }
        }

        $resultHome = null;
        $resultAway = null;
        $aggResultHome = null;
        $aggResultAway = null;
        if ($isStarted) {
            $resultHomeFt = data_get($match_json, 'score.fullTime.homeTeam');
            $resultAwayFt = data_get($match_json, 'score.fullTime.awayTeam');
            $resultHomeEt = data_get($match_json, 'score.extraTime.homeTeam');
            $resultAwayEt = data_get($match_json, 'score.extraTime.awayTeam');
            $resultHome_penalties = data_get($match_json, 'score.penalties.homeTeam');
            $resultAway_penalties = data_get($match_json, 'score.penalties.awayTeam');
            $duration = data_get($match_json, 'score.duration');
            if ($duration === 'REGULAR'){
                $resultHome = $resultHomeFt;
                $resultAway = $resultAwayFt;
            } else if ($duration === 'EXTRA_TIME') {
                $resultHome = $resultHomeFt - $resultHomeEt;
                $resultAway = $resultAwayFt - $resultAwayEt;
                $aggResultHome = $resultHomeFt;
                $aggResultAway = $resultAwayFt;
            } else if ($duration === 'PENALTY_SHOOTOUT') {
                $resultHome = $resultHomeFt - $resultHomeEt - $resultHome_penalties;
                $resultAway = $resultAwayFt - $resultAwayEt - $resultAway_penalties;
                $aggResultHome = $resultHomeFt - $resultHome_penalties;
                $aggResultAway = $resultAwayFt - $resultAway_penalties;
            } else {
                throw new \Exception("Cannot parse score from match due to unrecognised 'duration' value: [${$duration}]");
            }
        }

        return new Game(
            data_get($match_json, 'id'),
            $type,
            $type == "group_stage" ? data_get($match_json, 'group') : data_get($match_json, 'stage'),
            $homeTeamId,
            $awayTeamId,
            $startTime ? $startTime->format("U") : null,
            $resultHome,
            $resultAway,
            $aggResultHome,
            $aggResultAway,
            $koWinner,
            $isDone,
            $isStarted,
        );
    }

    private function apiCall(string $additionalPath, bool $addCompetitionPrefix = true)
    {
        $url = config('api.path');
        if ($addCompetitionPrefix) {
            $url .= "competitions/" . $this->id;
        }
        $url .= "/". $additionalPath;

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
        if (app()->environment("testing")) {
            $data = json_decode('{"count":64,"filters":{},"competition":{"id":2000,"area":{"id":2267,"name":"World"},"name":"FIFA World Cup","code":"WC","plan":"TIER_ONE","lastUpdated":"2022-05-09T19:45:29Z"},"matches":[{"id":391882,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-20T16:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_A","lastUpdated":"2022-11-14T01:32:00Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":8030,"name":"Qatar"},"awayTeam":{"id":791,"name":"Ecuador"},"referees":[]},{"id":391887,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-21T13:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_B","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":770,"name":"England"},"awayTeam":{"id":840,"name":"Iran"},"referees":[]},{"id":391881,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-21T16:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_A","lastUpdated":"2022-11-15T01:32:00Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":804,"name":"Senegal"},"awayTeam":{"id":8601,"name":"Netherlands"},"referees":[]},{"id":391888,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-21T19:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_B","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":771,"name":"United States"},"awayTeam":{"id":833,"name":"Wales"},"referees":[]},{"id":391893,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-22T10:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_C","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":762,"name":"Argentina"},"awayTeam":{"id":801,"name":"Saudi Arabia"},"referees":[]},{"id":391899,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-22T13:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_D","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":782,"name":"Denmark"},"awayTeam":{"id":802,"name":"Tunisia"},"referees":[]},{"id":391894,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-22T16:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_C","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":769,"name":"Mexico"},"awayTeam":{"id":794,"name":"Poland"},"referees":[]},{"id":391900,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-22T19:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_D","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":773,"name":"France"},"awayTeam":{"id":779,"name":"Australia"},"referees":[]},{"id":391911,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-23T10:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_F","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":815,"name":"Morocco"},"awayTeam":{"id":799,"name":"Croatia"},"referees":[]},{"id":391905,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-23T13:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_E","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":759,"name":"Germany"},"awayTeam":{"id":766,"name":"Japan"},"referees":[]},{"id":391906,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-23T16:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_E","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":760,"name":"Spain"},"awayTeam":{"id":793,"name":"Costa Rica"},"referees":[]},{"id":391912,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-23T19:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_F","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":805,"name":"Belgium"},"awayTeam":{"id":828,"name":"Canada"},"referees":[]},{"id":391917,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-24T10:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_G","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":788,"name":"Switzerland"},"awayTeam":{"id":781,"name":"Cameroon"},"referees":[]},{"id":391923,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-24T13:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_H","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":758,"name":"Uruguay"},"awayTeam":{"id":772,"name":"South Korea"},"referees":[]},{"id":391924,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-24T16:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_H","lastUpdated":"2022-08-12T13:10:40Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":765,"name":"Portugal"},"awayTeam":{"id":763,"name":"Ghana"},"referees":[]},{"id":391918,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-24T19:00:00Z","status":"SCHEDULED","matchday":1,"stage":"GROUP_STAGE","group":"GROUP_G","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":764,"name":"Brazil"},"awayTeam":{"id":780,"name":"Serbia"},"referees":[]},{"id":391889,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-25T10:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_B","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":833,"name":"Wales"},"awayTeam":{"id":840,"name":"Iran"},"referees":[]},{"id":391883,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-25T13:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_A","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":8030,"name":"Qatar"},"awayTeam":{"id":804,"name":"Senegal"},"referees":[]},{"id":391884,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-25T16:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_A","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":8601,"name":"Netherlands"},"awayTeam":{"id":791,"name":"Ecuador"},"referees":[]},{"id":391890,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-25T19:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_B","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":770,"name":"England"},"awayTeam":{"id":771,"name":"United States"},"referees":[]},{"id":391901,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-26T10:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_D","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":802,"name":"Tunisia"},"awayTeam":{"id":779,"name":"Australia"},"referees":[]},{"id":391895,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-26T13:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_C","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":794,"name":"Poland"},"awayTeam":{"id":801,"name":"Saudi Arabia"},"referees":[]},{"id":391902,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-26T16:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_D","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":773,"name":"France"},"awayTeam":{"id":782,"name":"Denmark"},"referees":[]},{"id":391896,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-26T19:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_C","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":762,"name":"Argentina"},"awayTeam":{"id":769,"name":"Mexico"},"referees":[]},{"id":391907,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-27T10:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_E","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":766,"name":"Japan"},"awayTeam":{"id":793,"name":"Costa Rica"},"referees":[]},{"id":391913,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-27T13:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_F","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":805,"name":"Belgium"},"awayTeam":{"id":815,"name":"Morocco"},"referees":[]},{"id":391914,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-27T16:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_F","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":799,"name":"Croatia"},"awayTeam":{"id":828,"name":"Canada"},"referees":[]},{"id":391908,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-27T19:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_E","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":760,"name":"Spain"},"awayTeam":{"id":759,"name":"Germany"},"referees":[]},{"id":391919,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-28T10:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_G","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":781,"name":"Cameroon"},"awayTeam":{"id":780,"name":"Serbia"},"referees":[]},{"id":391925,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-28T13:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_H","lastUpdated":"2022-08-12T13:10:40Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":772,"name":"South Korea"},"awayTeam":{"id":763,"name":"Ghana"},"referees":[]},{"id":391920,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-28T16:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_G","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":764,"name":"Brazil"},"awayTeam":{"id":788,"name":"Switzerland"},"referees":[]},{"id":391926,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-28T19:00:00Z","status":"SCHEDULED","matchday":2,"stage":"GROUP_STAGE","group":"GROUP_H","lastUpdated":"2022-08-12T13:10:40Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":765,"name":"Portugal"},"awayTeam":{"id":758,"name":"Uruguay"},"referees":[]},{"id":391885,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-29T15:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_A","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":8601,"name":"Netherlands"},"awayTeam":{"id":8030,"name":"Qatar"},"referees":[]},{"id":391886,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-29T15:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_A","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":791,"name":"Ecuador"},"awayTeam":{"id":804,"name":"Senegal"},"referees":[]},{"id":391891,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-29T19:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_B","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":833,"name":"Wales"},"awayTeam":{"id":770,"name":"England"},"referees":[]},{"id":391892,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-29T19:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_B","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":840,"name":"Iran"},"awayTeam":{"id":771,"name":"United States"},"referees":[]},{"id":391903,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-30T15:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_D","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":802,"name":"Tunisia"},"awayTeam":{"id":773,"name":"France"},"referees":[]},{"id":391904,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-30T15:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_D","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":779,"name":"Australia"},"awayTeam":{"id":782,"name":"Denmark"},"referees":[]},{"id":391897,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-30T19:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_C","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":794,"name":"Poland"},"awayTeam":{"id":762,"name":"Argentina"},"referees":[]},{"id":391898,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-11-30T19:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_C","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":801,"name":"Saudi Arabia"},"awayTeam":{"id":769,"name":"Mexico"},"referees":[]},{"id":391915,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-01T15:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_F","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":799,"name":"Croatia"},"awayTeam":{"id":805,"name":"Belgium"},"referees":[]},{"id":391916,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-01T15:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_F","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":828,"name":"Canada"},"awayTeam":{"id":815,"name":"Morocco"},"referees":[]},{"id":391909,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-01T19:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_E","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":766,"name":"Japan"},"awayTeam":{"id":760,"name":"Spain"},"referees":[]},{"id":391910,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-01T19:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_E","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":793,"name":"Costa Rica"},"awayTeam":{"id":759,"name":"Germany"},"referees":[]},{"id":391927,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-02T15:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_H","lastUpdated":"2022-08-12T13:10:40Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":772,"name":"South Korea"},"awayTeam":{"id":765,"name":"Portugal"},"referees":[]},{"id":391928,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-02T15:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_H","lastUpdated":"2022-08-12T13:10:40Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":763,"name":"Ghana"},"awayTeam":{"id":758,"name":"Uruguay"},"referees":[]},{"id":391921,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-02T19:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_G","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":781,"name":"Cameroon"},"awayTeam":{"id":764,"name":"Brazil"},"referees":[]},{"id":391922,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-02T19:00:00Z","status":"SCHEDULED","matchday":3,"stage":"GROUP_STAGE","group":"GROUP_G","lastUpdated":"2022-08-12T13:10:39Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":780,"name":"Serbia"},"awayTeam":{"id":788,"name":"Switzerland"},"referees":[]},{"id":391929,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-03T15:00:00Z","status":"SCHEDULED","matchday":null,"stage":"LAST_16","group":null,"lastUpdated":"2022-05-17T19:37:03Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391930,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-03T19:00:00Z","status":"SCHEDULED","matchday":null,"stage":"LAST_16","group":null,"lastUpdated":"2022-05-17T19:37:03Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391931,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-04T15:00:00Z","status":"SCHEDULED","matchday":null,"stage":"LAST_16","group":null,"lastUpdated":"2022-05-17T19:37:03Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391932,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-04T19:00:00Z","status":"SCHEDULED","matchday":null,"stage":"LAST_16","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391933,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-05T15:00:00Z","status":"SCHEDULED","matchday":null,"stage":"LAST_16","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391934,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-05T19:00:00Z","status":"SCHEDULED","matchday":null,"stage":"LAST_16","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391935,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-06T15:00:00Z","status":"SCHEDULED","matchday":null,"stage":"LAST_16","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391936,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-06T19:00:00Z","status":"SCHEDULED","matchday":null,"stage":"LAST_16","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391937,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-09T15:00:00Z","status":"SCHEDULED","matchday":null,"stage":"QUARTER_FINALS","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391938,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-09T19:00:00Z","status":"SCHEDULED","matchday":null,"stage":"QUARTER_FINALS","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391939,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-10T15:00:00Z","status":"SCHEDULED","matchday":null,"stage":"QUARTER_FINALS","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391940,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-10T19:00:00Z","status":"SCHEDULED","matchday":null,"stage":"QUARTER_FINALS","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391941,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-13T19:00:00Z","status":"SCHEDULED","matchday":null,"stage":"SEMI_FINALS","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391942,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-14T19:00:00Z","status":"SCHEDULED","matchday":null,"stage":"SEMI_FINALS","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391943,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-17T15:00:00Z","status":"SCHEDULED","matchday":null,"stage":"THIRD_PLACE","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]},{"id":391944,"season":{"id":1382,"startDate":"2022-11-20","endDate":"2022-12-18","currentMatchday":1},"utcDate":"2022-12-18T15:00:00Z","status":"SCHEDULED","matchday":null,"stage":"FINAL","group":null,"lastUpdated":"2022-05-17T19:37:04Z","odds":{"msg":"Activate Odds-Package in User-Panel to retrieve odds."},"score":{"winner":null,"duration":"REGULAR","fullTime":{"homeTeam":null,"awayTeam":null},"halfTime":{"homeTeam":null,"awayTeam":null},"extraTime":{"homeTeam":null,"awayTeam":null},"penalties":{"homeTeam":null,"awayTeam":null}},"homeTeam":{"id":null,"name":null},"awayTeam":{"id":null,"name":null},"referees":[]}]}', true);
        } else {
            $data = $this->apiCall('matches');
        }

        $matches = data_get($data, 'matches');

        return collect($matches)->map(fn($m) => self::parseGame($m))->filter();
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


        $responses = Http::pool(function (Pool $pool) use ($teamIds, $userAgents) {
            return $teamIds->map(
                function($teamId) use($pool, $userAgents) {
                    $langId = rand(1,50);
                    $baseUrl = "https://webws.365scores.com/web/stats/?appTypeId=5&langId=$langId&userCountryId=6&competition=5930";
                    return $pool->as($teamId)->withUserAgent(Arr::random($userAgents))->get($baseUrl . "&competitor=" . self::translate365TeamId($teamId));
                }
            )->toArray();
        });

        $players = collect();

        /** @var Response $response */
        foreach ($responses as $teamId => $response) {
            $stats = $response->collect("stats");

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

}