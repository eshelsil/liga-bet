<?php

namespace App\Http\Controllers;

use App\Actions\UpdateGameBets;
use App\Actions\UpdateLeaderboards;
use App\Bet;
use App\Bets\BetGroupsRank\BetGroupRankRequest;
use App\Bets\BetMatch\BetMatch;
use App\Bets\BetMatch\BetMatchRequest;
use App\Bets\BetSpecialBets\BetSpecialBetsRequest;
use App\Competition;
use App\DataCrawler\AbstractCrawlerMatch;
use App\DataCrawler\Crawler;
use App\Enums\BetTypes;
use App\Game;
use App\SpecialBets\SpecialBet;
use App\Team;
use App\Group;
use App\User;
use App\Player;
use App\Ranks;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Exceptions\JsonException;
use App\InvitaionsForTournamentAdmin;
use Carbon\Carbon;
use \Exception;
use Illuminate\Http\JsonResponse;
use Mail;
use Storage;
use Validator;

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


    public function sendGlobalNotification(Request $request)
    {
        User::query()->whereNotNull("fcm_token")->get()->map->sendNotifications($request->get("title"), $request->get("body"));
        return response()->json('Done', 200);
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

    public function grantTournamentAdminPermission(Request $request)
    {
        $email = $request->email;
        $validator = Validator::make(["email" => $email], [
            'email' => 'required|string|min:4'
        ])->validate();

        InvitaionsForTournamentAdmin::updateOrInsert(
            ['email' => $email],
            ['created_at' => Carbon::now()],
        );

        Mail::send('email.invitation-for-tournament-admin', ['email' => $email], function($message) use($email){
            $message->to($email);
            $message->subject('ליגה ב\' - הזמנה לפתיחת טורניר משלך');
        });

        return new JsonResponse('email sent', 200);
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

    public function createNewRankingRow(){
        Ranks::updateRanks();
        return 'DONE';
    }
    
    public function updateLastRankingRow(){
        Ranks::updateLastRank();
        return 'DONE';
    }
    
    public function removeLastRankingRow(){
        Ranks::removeLastRank();
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

    public function completeMatch(UpdateGameBets $updateGameBets,
        UpdateLeaderboards $updateLeaderboards,
        $id, $scoreHome = null, $scoreAway = null, $isAwayWinner = null
    ) {
        /** @var Game $game */
        $game = Game::query()->find($id);
        if ($game->isKnockout() && !is_null($scoreHome)
            && $scoreHome == $scoreAway && is_null($isAwayWinner)){
            throw new \InvalidArgumentException("Score is tied on a knockout game and \"isAwayWinner\" param is not given");
        }
        $updateGameBets->handle($game, $scoreHome, $scoreAway, $isAwayWinner);
        $updateLeaderboards->handle($game->competition);
        return "completed";
    }

    public function removeMatchResult($id) {
        /** @var Game $match */
        $match = Game::query()->find($id);
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
        $custom_special_bet_ids = [SpecialBet::getByType(SpecialBet::TYPE_MVP)->id, SpecialBet::getByType(SpecialBet::TYPE_MOST_ASSISTS)->id];
        $bets = Bet::where('type', BetTypes::SpecialBet)
                ->whereIn('type_id', $custom_special_bet_ids)
                ->get();
        $bets = $bets->filter(function($bet) use ($from_name){
            return json_decode($bet->data)->answer == $from_name;
        });
        foreach($bets as $bet){
            $bet->data = json_encode(["answer" => $to_name]);
            echo "Formatting bet value from {{$from_name}} to {{$to_name}}:  ".
                "Bet ID - {{$bet->id}}  |  User ID - {{$bet->user_id}} <br><br>";
            $bet->save();
        }
        return "DONE";
    }

    public function deleteMatch($matchId)
    {
        $match = Game::query()->find($matchId);
        if (!$match) {
            return "Game not found";
        }

        Bet::query()
           ->where("type", BetTypes::Game)
           ->where("type_id", $match->id)
           ->delete();

        $match->delete();
        echo "Game deleted";
    }
    
    public function setPermission(Request $request){
        $request->validate([
            "user_id" => ["required", "integer", "exists:users,id"],
            "permission" => ["required", Rule::in([User::TYPE_TOURNAMENT_ADMIN, User::TYPE_USER, User::TYPE_ADMIN])]
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
        /** @var Game $match */
        $match = Game::query()->find($matchId);
        echo "Game Found: ". trans("teams.{$match->team_home_id}") . " - " . trans("teams.{$match->team_away_id}");
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
        $group_a_teams = $group_a->teams->keyBy("id");
        $group_b_teams = $group_b->teams->keyBy("id");
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
          ->where("type", BetTypes::Game)
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
