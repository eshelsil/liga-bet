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
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Exceptions\JsonException;
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
       $this->ApiFetchController = new ApiFetchController();
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

    public function showTools()
    {
        return view('admin.tools_index');
    }

    public function downloadInitialData()
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
        self::saveDefaultScorers();
    }

    public function showAddScorer()
    {
        return view('admin.add_scorer');
    }

    public function addScorer(Request $request)
    {
        if (!Group::areBetsOpen()){
            throw new JsonException("Adding players to scorers table is not allowed when specia_bets are closed", 403);
        }
        $playerData = [
            "name" => $request->name,
            "external_id" => $request->id,
            "team_id" => $request->team_id,
        ];
        Scorer::register_player($playerData);
        return response()->json('Done', 200);
    }

    public function saveDefaultScorers()
    {
        if (!Group::areBetsOpen()){
            throw new JsonException("Adding players to scorers table is not allowed when specia_bets are closed", 403);
        }
        $teamIdByExtId = Team::getExternalIdToIdMap();
        
        $topScorerDefaultBets = collect(config('tournamentData.topScorerBets'))->map(function($playerData) use($teamIdByExtId){
            $playerData['team_id'] = $teamIdByExtId[$playerData['team_ext_id']];
            $playerData['external_id'] = $playerData['id'];
            return $playerData;
        })->toArray();
        Scorer::register_players($topScorerDefaultBets);
        return 'DONE';
    }

    public function removeIrrelevantScorers()
    {
        if (Group::areBetsOpen()){
            throw new JsonException("Removing players from scorers table is not allowed when specia_bets are still open", 403);
        }
        $specialBetId = SpecialBet::getBetTypeIdByName('top_scorer');
        $relevantBets = Bet::where("type", BetTypes::SpecialBet)
            ->where('type_id', $specialBetId)
            ->get();
        $relevantPlayerIds = $relevantBets->map(function($bet){
            return $bet->getData('answer');
        })->toArray();
        Scorer::whereNotIn('external_id', $relevantPlayerIds)->delete();
        return 'DONE';
    }

    public function fetchGames(){
        $this->ApiFetchController->fetchGames();
    }

    public function fetchScorers(){
        $this->ApiFetchController->fetchScorers();
    }

    public function fetchStandings(){
        $this->ApiFetchController->fetchStandings();
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

    public function calculateGroupRanks(){
        $completedGroups = Group::all()->filter(function($g){
            return $g->isComplete();
        });
        foreach ($completedGroups as $group){
            $group->calculateBets();
        }
        return 'DONE';
    }

    public function setNametoUser(Request $request) {
        $username = $request->username;
        $new_name = $request->new_name;
        $user = User::where('username', $username)->first();
        if (!$user){
            throw new JsonException("There is no user with username {{$username}}", 400);
        }
        $user->name = $new_name;
        $user->save();
        return response()->json(200);
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
        $user->password = Hash::make("1234");
        $user->save();
        return "reset User {$user->name} password to \"1234\"";
    }

    public function completeMatch($id, $scoreHome = null, $scoreAway = null) {
        /** @var Match $match */
        $match = Match::query()->find($id);
        $match->completeBets($scoreHome, $scoreAway);
        return "completed";
    }

    public function removeMatchResult($id) {
        /** @var Match $match */
        $match = Match::query()->find($id);
        $match->result_home = null;
        $match->result_away = null;
        $match->ko_winner = null;
        $match->save();
        $match->decompleteBets();
        return "completed";
    }

    public function formatSpecialBetsCustomAnswer(Request $request) {
        $from_name = $request->from_name;
        $to_name = $request->to_name;
        $custom_special_bet_ids = [SpecialBet::getBetTypeIdByName('mvp'), SpecialBet::getBetTypeIdByName('most_assists')];
        $bets = Bet::where('type', BetTypes::SpecialBet)
                ->whereIn('type_id', $custom_special_bet_ids)
                ->where('data->answer', $from_name)
                ->get();
        foreach($bets as $bet){
            $bet->data = json_encode(["answer" => $to_name]);
            echo "Formatting bet value from {{$from_name}} to {{$to_name}}:  ".
                "Bet ID - {{$bet->id}}  |  User ID - {{$bet->user_id}} <br><br>";
            $bet->save();
        }
        return "DONE";
    }


    public function calculateSpecialBets() {
        return $this->ApiFetchController->calculateSpecialBets();
    }

    public function calculateSpecialBet($name) {
        return $this->ApiFetchController->calculateSpecialBets([$name]);
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

    public static function flipMatchBet($matchId, $userId = null)
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

    public static function switchGroups($external_id_a, $external_id_b)
    {
        $group_a = Group::findByExternalId($external_id_a);
        if (!$group_a){
            throw new \InvalidArgumentException("Could not find a group with exernal id {{$external_id_a}}");
        }
        $group_b = Group::findByExternalId($external_id_b);
        if (!$group_b){
            throw new \InvalidArgumentException("Could not find a group with exernal id {{$external_id_b}}");
        }
        echo "Switch groups: {$group_a->getName()} & {$group_b->getName()}...<br><br>";
        $group_a_teams = $group_a->getGroupTeamsById();
        $group_b_teams = $group_b->getGroupTeamsById();
        echo "<br>Changeing group_id of Teams:";
        foreach($group_a_teams as $team_id => $team){
            $curr_g_id = $team->group_id;
            $team->group_id = $group_b->external_id;
            $team->save();
            echo "<br>\"{$team->name}\": \t '{$curr_g_id}' -> '{$team->group_id}'";
        }
        foreach($group_b_teams as $team_id => $team){
            $curr_g_id = $team->group_id;
            $team->group_id = $group_a->external_id;
            $team->save();
            echo "<br>\"{$team->name}\": \t '{$curr_g_id}' -> '{$team->group_id}'";

        }
        echo "<br>";

        $relevant_bets = Bet::where('type', BetTypes::GroupsRank)
            ->whereIn('type_id', [$group_a->id, $group_b->id])->get();
        $relevant_bets_by_user_id = $relevant_bets->groupBy('user_id');
        $userIdToNameMap = User::getIdToNameMap();
        echo "<br><br>Updated GroupRankBet of users:";
        foreach($relevant_bets_by_user_id as $user_id => $bets){
            $name = $userIdToNameMap[$user_id];
            echo "<br>....{{$name}}:";
            foreach($bets as $bet){
                $curr_group = $bet->type_id == $group_a->id ? $group_a : $group_b;
                $desired_group = $curr_group->id == $group_a->id ? $group_b : $group_a;
                $bet->type_id = $desired_group->id;
                $bet->save();
                echo "<br>........Bet of group \t {{$curr_group->name}} -> {{$desired_group->name}}";
            }
        }
        echo "<br><br>Note: real-life (actual) standings result of the groups were not changed";


        return "<br><br>Done";
    }

    public function switchBetMatchIDs($fromMatchID, $toMatchID) {
        DB::table("bets")
          ->where("type", BetTypes::Match)
          ->where("type_id", $fromMatchID)
          ->update(["type_id" => $toMatchID]);
    }

    public function createMonkey() {
        $monkey = User::create([
            'name' => 'הקוף',
            'username' => 'themonkey_2021',
            'password' => '',
            'permissions' => User::TYPE_MONKEY
        ]);
        $monkey->autoBetPreTournament();
        return "DONE";
    }

    public function deleteUser(Request $request){
        $request->validate([
            "username" => ["required", "string", "exists:users,username"],
            "should_delete_bets" => ["required", "boolean"]
        ]);
        $username = $request->get('username');
        $shouldDeleteBets = $request->get('should_delete_bets');

        $user = User::where('username', $username)->first();
        $userId = $user->id;
        if ($userId == $request->user()->id) {
            return response()->json(["message" => "User cannot delete himself"], 400);
        }
        $user->delete();

        if ($shouldDeleteBets){
            Bet::where('user_id', $userId)->delete();
        }
        return response()->json();
    }
}
