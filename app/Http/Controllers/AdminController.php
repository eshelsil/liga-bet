<?php

namespace App\Http\Controllers;

use App\Bet;
use App\Bets\BetGroupRank\BetGroupRankRequest;
use App\Bets\BetMatch\BetMatch;
use App\Bets\BetMatch\BetMatchRequest;
use App\DataCrawler\AbstractCrawlerMatch;
use App\DataCrawler\Crawler;
use App\Enums\BetTypes;
use App\Groups\Group;
use App\Match;
use App\Team;
use App\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
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
        $crawler = Crawler::getInstance();

        DB::table("teams")->truncate();
        DB::table("matches")->truncate();
        self::saveTeams($crawler->getData("teams", []));
        self::saveMatches($crawler->getGroupMatches());
    }

    public function downloadKnockoutMatches()
    {
        $crawler = Crawler::getInstance();

        self::saveMatches($crawler->getKnownOpenMatches());
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

    private static function saveMatches($crawlerMatches) {
        $existingMatchExternalIds = Match::all(["external_id"])->pluck("external_id")->toArray();

        /** @var AbstractCrawlerMatch $crawlerMatch */
        foreach ($crawlerMatches as $crawlerMatch) {
            if (in_array($crawlerMatch->getID(), $existingMatchExternalIds)) {
                echo "<br><br> Match {$crawlerMatch->getID()} " . trans("teams.{$crawlerMatch->getTeamHomeID()}") . " - " . trans("teams.{$crawlerMatch->getTeamAwayID()}") . "<br>Already Exists";
                continue;
            }
            $match = new Match();
            $match->external_id  = $crawlerMatch->getID();
            $match->type         = $crawlerMatch->getType();
            $match->sub_type     = $crawlerMatch->getSubType();
            $match->team_home_id = $crawlerMatch->getTeamHomeID();
            $match->team_away_id = $crawlerMatch->getTeamAwayID();
            $match->start_time   = $crawlerMatch->getStartTime();
            $match->result_home  = null;
            $match->result_away  = null;

            if ($crawlerMatch->isCompleted()) {
                $match->completeBets();
            } else {
                echo "<br><br>Match Home ({$match->getTeamHome()->name}): {$match->result_home} | Away ({$match->getTeamAway()->name}): {$match->result_away}";
            }
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

    public function resetPass($id) {
        $user = User::query()->find($id);
        $user->password = Hash::make("123123");
        $user->save();
        return "reset User {$user->name} pass";
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
        $crawler = Crawler::getInstance();
        self::saveMatches($crawler->getKnownOpenMatches());

        $matches = Match::query()
            ->where("type", "=", "groups") // The Crawler not showing valid data in knockouts
            ->whereNull("result_home")
            ->orderBy("start_time")
            ->get();
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

    public function completeGroupRank($groupID) {
        $crawler = Crawler::getInstance();

        $group = Group::find($groupID);
        $bets = Bet::query()
            ->where("type", BetTypes::GroupsRank)
            ->where("type_id", $groupID)
            ->get();

        $finalRequest = new BetGroupRankRequest($group, [
            "team-a" => $group->getTeamIDByRank(1),
            "team-b" => $group->getTeamIDByRank(2),
            "team-c" => $group->getTeamIDByRank(3),
            "team-d" => $group->getTeamIDByRank(4),
        ]);

        echo "FINAL RANKS: {$finalRequest->toJson()}<br><br>";
        /** @var Bet $bet */
        foreach ($bets as $bet) {
            try {
                $betRequest = new BetGroupRankRequest($group, $bet->getData());
                $bet->score = $betRequest->calculate($finalRequest);
                $bet->save();
                echo "USER {$bet->user_id} Score ({$bet->score}) RANKS: {$betRequest->toJson()}<br>";
            } catch (Exception $exception) {
                return $exception->getMessage();
                continue 1;
            }
        }
        return "completed";
    }

    public function parseGroupBets() {
//        Bet::query()->truncate();
        $data = self::parseCSV("resources/bets-data.csv");
        $matchs = Match::query()->where("type", "groups")->get();
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
                $betRequest = new BetMatchRequest($match, [
                    "result-home" => $score_a,
                    "result-away" => $score_b,
//                    "result-home" => $fixInput ? $score_b : $score_a,
//                    "result-away" => $fixInput ? $score_a : $score_b,
                ]);
                $bet = BetMatch::save($user, $betRequest);
            }

        }
    }

    public function parseGroupRankBets() {
        $data = self::parseCSV("resources/bets-data.csv");
        $users = User::all();
        foreach ($data as $userBets) {
            /** @var User $user */
            $user = $users->find($userBets["ID"]);
            $user->insertGroupRankData($userBets);
        }

        return "<br><br> Done";
    }

    public function parseSpecialBets() {
        Bet::query()->truncate();
        $data = self::parseCSV("resources/bets-data.csv");
        $users = User::all();
        foreach ($data as $userBets) {
            /** @var User $user */
//            $user = $users->find($userBets["ID"]);
//            foreach ($matchs as $match) {
//                $result = trim($userBets["g{$match->id}"]);
//                $score  = trim($userBets["s{$match->id}"]);
//                Log::debug("User: {$user->name}, Match {$match->id}, $score");
//
//                $score_a = explode(":", $score)[1];
//                $score_b = explode(":", $score)[0];
//
////                $fixInput = false;
////                if ($result == 1 && $score_a <  $score_b) {
////                    $fixInput = true;
////                }
//                $betRequest = new BetGroupRankRequest($match, [
//                    "result-home" => $score_a,
//                    "result-away" => $score_b,
////                    "result-home" => $fixInput ? $score_b : $score_a,
////                    "result-away" => $fixInput ? $score_a : $score_b,
//                ]);
//                $bet = BetMatch::save($user, $betRequest);
//            }

        }

        return "<br><br> Done";
    }

    public function deleteMatch($matchId)
    {
        $match = Match::query()->find($matchId);
        if (!$match) {
            return "Match not found";
        }

        Bet::query()
           ->where("type", BetTypes::Match)
           ->where("type_id", $match->id)
           ->delete();

        $match->delete();
        echo "Match deleted";
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
            $betMatch = new BetMatch($bet, $match, $bet->user);
            echo "<br><br>Update {$bet->user->name}<br>Before {$betMatch->getRequest()->getResultHome()}:{$betMatch->getRequest()->getResultAway()}";
            $betMatch->switchScore();
            echo "<br>After {$betMatch->getRequest()->getResultHome()}:{$betMatch->getRequest()->getResultAway()}";
        }

        return "<br><br>Done";
    }

    public function switchBetMatchIDs($fromMatchID, $toMatchID) {
        DB::table("bets")
          ->where("type", BetTypes::Match)
          ->where("type_id", $fromMatchID)
          ->update(["type_id" => $toMatchID]);
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
