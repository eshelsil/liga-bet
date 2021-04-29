<?php

namespace App\Http\Controllers;

use App\Bet;
use App\Bets\BetGroupRank\BetGroupRankRequest;
use App\Bets\BetMatch\BetMatch;
use App\Bets\BetMatch\BetMatchRequest;
use App\Bets\BetSpecialBets\BetSpecialBetsRequest;
use App\DataCrawler\AbstractCrawlerMatch;
use App\DataCrawler\Crawler;
use App\Enums\BetTypes;
use App\Groups\Group;
use App\Match;
use App\SpecialBets\SpecialBet;
use App\Team;
use App\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use \Exception;
use Storage;


class AdminController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
       $this->middleware('auth');
       $this->middleware('admin');
    }

    public function showUsersToConfirm()
    {
        $users_to_confirm = User::query()->where('permissions', 0)->get();
        return view('admin.confirm_users')->with(["users_to_confirm" => $users_to_confirm]);
    }

    public function showConfirmedUsers()
    {
        $users = User::query()->where('permissions', '>', 0)->get();
        return view('admin.confirmed_users')->with(["users" => $users]);
    }

    public function showResetPassword($id)
    {
        $user = User::find($id);
        return view('admin.reset_password')->with(["user_id" => $user->id, "username" => $user->username]);
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

    public function fetchGames(){
        $json = Storage::disk('local')->get('api/matches.json');
        #where should locate fetched data??
        $json = json_decode($json, true);
        self::newSaveMatches(data_get($json, 'matches'));
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

    private static function getSubType($type){
        if ($type == 'GROUP_STAGE'){
            return 'group';
        }
        return 'knockout';
    }

    private static function newSaveMatches($matches) {
        $existingMatchExternalIds = Match::all(["external_id"])->pluck("external_id")->toArray();

        /** @var AbstractCrawlerMatch $crawlerMatch */
        foreach ($matches as $match) {
            $id = data_get($match, 'id');
            // dd($id);
            if (in_array($id, $existingMatchExternalIds)) {
                $home_team = data_get($match, 'homeTeam.name');
                $away_team = data_get($match, 'awayTeam.name');
                echo "<br><br> Match {$id} " . "{$home_team}" . " - " . "{$away_team}" . "<br>Already Exists";
                continue;
            }
            
            $start_time =  \DateTime::createFromFormat(\DateTime::ISO8601, data_get($match, 'utcDate'));
            $Match = new Match();
            $Match->external_id  = data_get($match, 'id');
            $Match->type         = data_get($match, 'stage');
            
            $Match->sub_type     = self::getSubType(data_get($match, 'stage'));
            $Match->team_home_id = data_get($match, 'homeTeam.id');
            $Match->team_away_id = data_get($match, 'awayTeam.id');
            $Match->start_time   = $start_time ? $start_time->format("U") : null;
            $Match->result_home  = data_get($match, 'score.fullTime.homeTeam');
            $Match->result_away  = data_get($match, 'score.fullTime.awayTeam');

            // if ($crawlerMatch->isCompleted()) {
            //     $Match->completeBets();
            // } else {
            //     echo "<br><br>Match Home ({$Match->getTeamHome()->name}): {$Match->result_home} | Away ({$Match->getTeamAway()->name}): {$Match->result_away}";
            // }
            $Match->save();
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

    public function setPassword(Request $request) {
        $id = $request->user_id;
        $validated = $request->validate([
            'new_password' => 'required|string|min:4|confirmed'
        ]);
        $password = $request->new_password;
        $user = User::query()->find($id);
        $user->password = Hash::make($password);
        $user->save();
        return response()->json(200);
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

    public function completeMatch($id, $scoreHome = null, $scoreAway = null) {
        /** @var Match $match */
        $match = Match::query()->find($id);
        $match->completeBets($scoreHome, $scoreAway);
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

    public function completeSpecialBet($specialBetID) {
        $specialBet = SpecialBet::find($specialBetID);
        $bets = Bet::query()
                   ->where("type", BetTypes::SpecialBet)
                   ->where("type_id", $specialBetID)
                   ->get();

        $finalRequest = new BetSpecialBetsRequest($specialBet, [
            "answers" => $specialBet->getAnswers(),
        ]);

        echo "FINAL answer: {$finalRequest->toJson()}<br><br>";
        /** @var Bet $bet */
        foreach ($bets as $bet) {
            try {
                $betRequest = new BetSpecialBetsRequest($specialBet, $bet->getData());
                $bet->score = $betRequest->calculate($finalRequest);
                $bet->save();
                echo "USER {$bet->user_id} Score ({$bet->score}) Answer: {$betRequest->toJson()}<br>";
            } catch (Exception $exception) {
                return $exception->getMessage();
                continue 1;
            }
        }
        return "completed";
    }

    public function parseGroupBets($userId = null, $fixMatchIds = null) {
        $data = self::parseCSV("resources/bets-data.csv");
        $matchs = Match::query()->where("type", "groups")->get();
        $users = $userId ? User::query()->where("id", $userId)->get() : User::all();
        $fixMatchIds = explode("-",$fixMatchIds);
        foreach ($data as $userBets) {
            /** @var User $user */
            /** @var Match $match */
            $user = $users->find($userBets["ID"]);
            if (!$user) {
                continue;
            }
            foreach ($matchs as $match) {
                $result = trim($userBets["g{$match->id}"]);
                $score  = trim($userBets["s{$match->id}"]);
                Log::debug("User: {$user->name}, Match {$match->id}, $score");

                $score_a = explode(":", $score)[1];
                $score_b = explode(":", $score)[0];

                $fixInput = in_array($match->id, $fixMatchIds);
                $betRequest = new BetMatchRequest($match, [
//                    "result-home" => $score_a,
//                    "result-away" => $score_b,
                    "result-home" => $fixInput ? $score_b : $score_a,
                    "result-away" => $fixInput ? $score_a : $score_b,
                ]);
                $bet = BetMatch::save($user, $betRequest);

                if (!is_null($match->result_home) && !is_null($match->result_away)) {
                    $finalResult = new BetMatchRequest($match, [
                        "result-home" => "{$match->result_home}",
                        "result-away" => "{$match->result_away}",
                    ]);
                    $bet->score = $betRequest->calculate($finalResult);
                    $bet->save();
                }

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

    public function parseSpecialBets($userId = null) {
        $data = self::parseCSV("resources/bets-data.csv");
        $users = $userId ? User::query()->where("id", $userId)->get() : User::all();

        $guide = [
            "1" => ["BestAttackTeam"],
            "2" => ["BestDefenceTeam"],
            "3" => ["finalTeamA", "finalTeamB"],
            "4" => ["winner"],
            "5" => ["bestAssister"],
            "6" => ["bestStriker"],
            "7" => ["MVP"],
        ];

        foreach ($data as $userBets) {
            /** @var User $user */
            $user = $users->find($userBets["ID"]);
            if (!$user) {
                continue;
            }

            $user->insertSpecialBetsData($userBets, $guide);
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
    
    public function setPermission(Request $request){
        $request->validate([
            "user_id" => ["required", "integer", "exists:users,id"],
            "permission" => ["required", Rule::in([User::TYPE_NOT_CONFIRMED, User::TYPE_CONFIRMED, User::TYPE_ADMIN])]
        ]);

        $user_id = $request->get('user_id');
        $permission = $request->get('permission');
        
        $user = User::find($user_id);
        if ($user->id == $request->user()->id) {
            return response()->json(["message" => "User cannot change his own permissions"], 400);
        }
        $user->permissions = $permission;
        $user->save();
        return response()->json();
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
