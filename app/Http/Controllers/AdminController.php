<?php

namespace App\Http\Controllers;

use App\Team;
use \Guzzle\Http\Client as HttpClient;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
//        $this->middleware('auth');
    }

    public function downloadData()
    {
        $client = new HttpClient();
        $res = $client->get('https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json')->send();
        $fullData = json_decode($res->getBody());

        DB::table("teams")->truncate();
        DB::table("matches")->truncate();
        self::saveTeams(data_get($fullData, "teams", []));
        self::saveMatches("groups", "a", data_get($fullData, "groups.a.matches", []));
        self::saveMatches("groups", "b", data_get($fullData, "groups.b.matches", []));
        self::saveMatches("groups", "c", data_get($fullData, "groups.c.matches", []));
        self::saveMatches("groups", "d", data_get($fullData, "groups.d.matches", []));
        self::saveMatches("groups", "e", data_get($fullData, "groups.e.matches", []));
        self::saveMatches("groups", "f", data_get($fullData, "groups.f.matches", []));
        self::saveMatches("groups", "g", data_get($fullData, "groups.g.matches", []));
        self::saveMatches("groups", "h", data_get($fullData, "groups.h.matches", []));
    }

    private static function saveTeams($teamsData) {
        foreach ($teamsData as $teamData) {
            $team = new \App\Team();
            $team->external_id = $teamData->id;
            $team->name = $teamData->name;
            $team->save();
            echo $team->id . ". ".$team->name . "<br/>";
        }
    }

    private static function saveMatches($type, $subType, $matchesData) {
        foreach ($matchesData as $matchData) {
            $time =  \DateTime::createFromFormat(\DateTime::ISO8601, $matchData->date);

            $match = new \App\Match();
            $match->external_id  = $matchData->name;
            $match->type         = $type;
            $match->sub_type     = $subType;
            $match->team_home_id = $matchData->home_team;
            $match->team_away_id = $matchData->away_team;
            $match->start_time   = $time ? $time->format("U") : false;
            $match->result_home  = $matchData->home_result;
            $match->result_away  = $matchData->away_result;
            $match->save();
        }
    }

}
