<?php

namespace App\Http\Controllers;

use App\Bet;
use App\Bets\BetGame\BetGame;
use App\Bets\BetGame\BetGameRequest;
use App\DataCrawler\Crawler;
use App\Match;
use App\Team;
use App\User;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use \Exception;

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
        $crawler = new Crawler();

        DB::table("teams")->truncate();
        DB::table("matches")->truncate();
        self::saveTeams($crawler->getData("teams", []));
        self::saveMatches("groups", "a", $crawler->getData("groups.a.matches", []));
        self::saveMatches("groups", "b", $crawler->getData("groups.b.matches", []));
        self::saveMatches("groups", "c", $crawler->getData("groups.c.matches", []));
        self::saveMatches("groups", "d", $crawler->getData("groups.d.matches", []));
        self::saveMatches("groups", "e", $crawler->getData("groups.e.matches", []));
        self::saveMatches("groups", "f", $crawler->getData("groups.f.matches", []));
        self::saveMatches("groups", "g", $crawler->getData("groups.g.matches", []));
        self::saveMatches("groups", "h", $crawler->getData("groups.h.matches", []));
    }

    private static function saveTeams($teamsData) {
        foreach ($teamsData as $teamData) {
            $team = new Team();
            $team->external_id = $teamData->id;
            $team->name = $teamData->name;
            $team->save();
            echo $team->id . ". ".$team->name . "<br/>";
        }
    }

    private static function saveMatches($type, $subType, $matchesData) {
        foreach ($matchesData as $matchData) {
            $time =  \DateTime::createFromFormat(\DateTime::ISO8601, $matchData->date);

            $match = new Match();
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

    public function saveUsers() {
        $data = self::parseCSV("resources/bets-data.csv");
        User::query()->truncate();
        foreach ($data as $user) {
            User::create([
                'name' => $user['Name'],
                'email' => "0".$user['Phone'],
                'phone' => "0".$user['Phone'],
                'password' => Hash::make("0".$user['Phone']),
                'permissions' => 0
            ]);
        }
        return User::all()->toJson();
    }

    public function showHomeA($id = null) {
        var_dump(self::parseCSV("resources/bets-data.csv"));
    }

    public function completeMatch($id) {
        /** @var Match $match */
        $match = Match::query()->find($id);
        $match->completeBets();
        return "completed";
    }

    public function completeAllMatches() {

        $matches = Match::query()->whereNull("result_home")->orderBy("start_time")->get();
        /** @var Match $match */
        foreach ($matches as $match) {
            try {
                echo "<hr><br>";
                $match->completeBets();
            } catch (Exception $exception) {
                return $exception->getMessage();
                continue 1;
            }
        }
        return "completed";
    }

    public function parseBets() {
        Bet::query()->truncate();
        $data = self::parseCSV("resources/bets-data.csv");
        $matchs = Match::all();
        $users = User::all();
        foreach ($data as $userBets) {
            /** @var User $user */
            $user = $users->find($userBets["ID"]);
            foreach ($matchs as $match) {
                $result = trim($userBets["g{$match->id}"]);
                $score  = trim($userBets["s{$match->id}"]);
                Log::debug("User: {$user->name}, Match {$match->id}, $score");

                $score_a = explode(":", $score)[1];
                $score_b = explode(":", $score)[0];

//                $fixInput = false;
//                if ($result == 1 && $score_a <  $score_b) {
//                    $fixInput = true;
//                }
                $betRequest = new BetGameRequest($match, [
                    "result-home" => $score_a,
                    "result-away" => $score_b,
//                    "result-home" => $fixInput ? $score_b : $score_a,
//                    "result-away" => $fixInput ? $score_a : $score_b,
                ]);
                $bet = BetGame::save($user, $betRequest);
            }

        }
    }

    public static function fixMatchBet($matchId, $userId = null)
    {
        /** @var Match $match */
        $match = Match::query()->find($matchId);
        echo "Match Found: ". trans("teams.{$match->team_home_id}") . " - " . trans("teams.{$match->team_away_id}");
        $bets = $match->getBets();
        if ($userId) {
            $bets = $bets->filter(function($bet) use ($userId) { return $bet->user_id == $userId; });
        }

        /** @var Bet $bet */
        foreach ($bets as $bet) {
            $betGame = new BetGame($bet, $match, $bet->user);
            echo "<br><br>Update {$bet->user->name}<br>Before {$betGame->getRequest()->getResultHome()}:{$betGame->getRequest()->getResultAway()}";
            $betGame->switchScore();
            echo "<br>After {$betGame->getRequest()->getResultHome()}:{$betGame->getRequest()->getResultAway()}";
        }

        return "<br><br>Done";
    }

    public static function parseCSV($filePath) {
        $filePath = "../{$filePath}";

        $csv = array_map('str_getcsv', file($filePath));
        array_walk($csv, function(&$a) use ($csv) {
            $a = array_combine($csv[0], $a);
        });
        array_shift($csv); # remove column header

        return $csv;
    }
}
