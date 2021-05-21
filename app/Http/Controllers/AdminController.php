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
use App\Match;
use App\SpecialBets\SpecialBet;
use App\Team;
use App\Group;
use App\User;
use App\Scorer;
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
        DB::table("groups")->truncate();
        DB::table("matches")->truncate();
        $teams = $crawler->fetchTeams();
        self::saveTeams($teams);
        $groups = array_unique($teams->pluck('group_id')->toArray());
        self::saveGroups($groups);
        self::fetchGames();
    }

    public function downloadKnockoutMatches()
    {
        $crawler = Crawler::getInstance();

        self::saveMatches($crawler->getKnownOpenMatches());
    }

    public function removeIrrelevantScorers()
    {
        $specialBetId = SpecialBet::getBetTypeIdByName('top_scorer');
        $relevantBets = Bet::where("type", BetTypes::SpecialBet)
            ->where('type_id', $specialBetId)
            ->get();
        $relevantPlayerIds = $relevantBets->map(function($bet){
            return $bet->getData('answer');
        })->toArray();
        Scorer::all()->each(function($scorer) use($relevantPlayerIds){
            if (!in_array($scorer->external_id, $relevantPlayerIds)){
                $scorer->delete();
            }

        });
    }

    public function printCustomScorerBets()
    {
        $customPlayers = Scorer::getCustomPlayers();
        if ($customPlayers->count() == 0){
            echo "All players on \"scorers\" table are registered with valid external id!  :)";
            return;
        }
        $customPlayers->each(function($player){
            echo $player->name . "<br>";
        });
    }

    public function fetchGames(){
        $crawler = Crawler::getInstance();
        $matches = $crawler->fetchMatches();
        
        self::saveNewMatches($matches);
    }

    public function fetchScorers(){
        $crawler = Crawler::getInstance();
        $scorers = $crawler->fetchScorers();
        self::updateScorers($scorers);
    }

    public function fetchStandings(){
        $crawler = Crawler::getInstance();
        $final_standings = $crawler->fetchGroupStandings();
        $team_ext_id_to_id = Team::getExternalIdToIdMap();
        $groupsNotCompleted = Group::all()->filter(function($g){
            return !$g->isComplete();
        });
        $relevantGroupIds = $groupsNotCompleted->pluck('external_id')->toArray();
        foreach($final_standings as $group_id => $standings){
            if (!in_array($group_id, array_values($relevantGroupIds))){
                continue;
            }
            $group = $groupsNotCompleted->where('external_id', $group_id)->first();
            $standings = $standings->map(function($row) use ($team_ext_id_to_id){
                $external_team_id = $row['team_ext_id'];
                $row['team_id'] = $team_ext_id_to_id[$external_team_id];
                return $row;
            });
            $group->standings = json_encode($standings);
            $group->save();
            echo "updated final standings of group \"{$group->name}\"<br>";
            $group->calculateBets();
            if (Match::isGroupStageDone()){
                $this->calculateSpecialBets(['offensive_team']);
            }
        }
    }

    private static function updateScorers($scorers) {
        $relevantScorers = Scorer::all();
        $saveFirstAnyway = Match::isTournamentDone();
        foreach ($scorers as $index => $scorer){
            $id = data_get($scorer, 'player.id');
            if (!in_array($id, $relevantScorers->pluck('external_id'))){
                $saveAnyway = $index == 0 && $saveFirstAnyway;
                if (!$saveAnyway){
                    continue;
                }
                $scorerModel = new Scorer();
                $scorerModel->external_id = $id;
                $scorerModel->name = data_get($scorer, 'player.name');
            }
            $goals = data_get($scorer, 'numberOfGoals');
            $scorerModel = $scorerModel ?? $relevantScorers->where('external_id', $id)->first();
            if ($goals !== $scorerModel->goals){
                $scorerModel->goals = $goals;
                $scorerModel->save();
            }
        }
    }

    private static function saveTeams($teamsData) {
        foreach ($teamsData as $teamData) {
            $team = new Team();
            $team->external_id = data_get($teamData, 'id');
            $team->name = data_get($teamData, 'name');
            $team->crest_url = data_get($teamData, 'crestUrl');
            $team->group_id = data_get($teamData, 'group_id');
            $team->save();
            echo $team->id . ". ".$team->name . "<br/>";
        }
    }

    private static function saveGroups($groups) {
        foreach ($groups as $group_id) {
            $group = new Group();
            $group->external_id = $group_id;
            $group->name = "Group ".substr($group_id, -1);
            $group->save();
            echo $group->id . ". ".$group->name . "<br/>";
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


    private static function saveNewMatches($matches) {
        $existingMatches = Match::all();
        $new_matches = $matches->filter(function($m) use ($existingMatches){
            $id = data_get($m, 'id');
            return !in_array($id, $existingMatches->pluck('external_id')->toArray());
        });

        $matches_with_no_score = $existingMatches->where("is_done", false)
                                    ->keyBy->external_id;
        $new_scores = $matches->filter(function($m) use ($matches_with_no_score){
            $id = data_get($m, 'id');
            return data_get($m, 'is_done') && in_array($id, $matches_with_no_score->pluck('external_id')->toArray());
        });

        foreach ($new_matches as $match_data) {
            $match = new Match();
            $match->external_id  = data_get($match_data, 'id');
            $match->type         = data_get($match_data, 'type');
            $match->sub_type     = data_get($match_data, 'sub_type');
            $match->team_home_id = data_get($match_data, 'team_home_id');
            $match->team_away_id = data_get($match_data, 'team_away_id');
            $match->start_time   = data_get($match_data, 'start_time');
            $match->save();
        }

        foreach ($new_scores as $match_data)  {
            $match = $matches_with_no_score->where('external_id', data_get($match_data, 'id'))->first();
            $match->result_home  = data_get($match_data, 'result_home');
            $match->result_away  = data_get($match_data, 'result_away');
            $match->ko_winner  = data_get($match_data, 'ko_winner');
            $match->save();
            $match->completeBets();
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

    public function calculateSpecialBets($types = null) {
        SpecialBet::all()->each(function($specialBet){
            if ($types && !in_array($specialBet->getName(), $types)){
                return;
            }
            $specialBet->calculateBets();
        });

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
