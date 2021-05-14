<?php
/**
 * Created by PhpStorm.
 * User: michael
 * Date: 16/06/18
 * Time: 14:26
 */

namespace App\DataCrawler;

use \Illuminate\Support\Collection;
use \Guzzle\Http\Client as HttpClient;


class Crawler
{

    protected static $instance = null;


    private function __clone()
    {

    }

    private function __wakeup()
    {

    }

    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new static();
        }
        return self::$instance;
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

        return [
            'id' => data_get($match_json, 'id'),
            'type' => $type,
            'sub_type' => $type == "group_stage" ? data_get($match_json, 'group') : data_get($match_json, 'stage'),
            'team_home_id' => $home_team_id,
            'team_away_id' => $away_team_id,
            'start_time' => $start_time ? $start_time->format("U") : null,
            'result_home'  => data_get($match_json, 'score.fullTime.homeTeam'),
            'result_away'  => data_get($match_json, 'score.fullTime.awayTeam'),
            'is_done' => $winner_side !== null,
            'ko_winner' => $ko_winner
        ];
    }

    public function fetchTeams(){
        $api_path = config('api.path');
        $api_token = config('api.api_token');
        $headers = ['X-Auth-Token' => $api_token];
        $client = new HttpClient();
        $res = $client->get("{$api_path}/standings", $headers)->send();
        $standings = data_get(json_decode($res->getBody()), 'standings');

        $groups = collect($standings)->where('type', 'TOTAL');
        $teams = [];
        foreach ($groups as $group){
            $group_id = data_get($group, 'group');
            $group_teams = data_get($group, 'table.*.team');
            $teams = array_merge($teams, array_map(function($t) use($group_id){
                return array_merge(['home_id' => $group_id], get_object_vars($t));
            }, $group_teams));
        }
        return collect($teams);
    }

    public function fetchMatches()
    {
        $api_path = config('api.path');
        $api_token = config('api.api_token');
        $headers = ['X-Auth-Token' => $api_token];
        $client = new HttpClient();
        $res = $client->get("{$api_path}/matches", $headers)->send();
        $matches = data_get(json_decode($res->getBody()), 'matches');

        return collect($matches)->map(function($m){
            return self::parse_match($m);
        })->filter(function($m){
            return !is_null($m);
        });
    }

    /**
     * Crawler constructor.
     */
    protected function __construct()
    {
        // $this->queryData();
        $this->mockData();
    }

    private function mockData()
    {
//        $this->data->groups->a->winner = 2;
//        $this->data->groups->a->runnerup = 4;
//        $this->data->groups->b->winner = 5;
//        $this->data->groups->b->runnerup = 8;

//        $this->data->knockout->round_16->matches[0]->winner = 2;
//        $this->data->knockout->round_16->matches[1]->winner = 5;
    }

}