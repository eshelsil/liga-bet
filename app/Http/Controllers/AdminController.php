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
            throw JsonException(403, "Adding players to scorers table is not allowed when specia_bets are closed");
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
            throw JsonException(403, "Adding players to scorers table is not allowed when specia_bets are closed");
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
            throw JsonException(403, "Removing players from scorers table is not allowed when specia_bets are still open");
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
        $match->save();
        $match->decompleteBets();
        return "completed";
    }


    public function calculateSpecialBets($types = null) {
        return $this->ApiFetchController->calculateSpecialBets($types);
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
}
