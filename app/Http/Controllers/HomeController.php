<?php

namespace App\Http\Controllers;

use App\Match;
use App\User;
use App\Team;
use App\Group;
use App\Bet;
use App\SpecialBets\SpecialBet;
use App\Enums\BetTypes;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
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

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {   
        $user = Auth::user();
        if (!$user->isConfirmed()){
            return  view('home')->with(["show_table" => false]);
        }
        $table = User::query()
            ->where('permissions', '>', 0)
            ->select(["users.id", "users.name", DB::raw("sum(bets.score) as total_score")])
            ->join("bets", function (JoinClause $join) {
                $join->on("users.id", "=", "user_id");
            })
            ->groupBy("users.id", "users.name")
            ->orderBy("total_score", "desc")
            ->get();

        $rank = 1;
        /** @var User $user */
        foreach ($table as $user) {
            $user->rank = $rank;
            $user->betsByType = $user->bets->groupBy("type");
            if ($user->total_score === null){
                $user->total_score = 0;
            }
            $rank++;
        }

        $teamsByExtId = Team::getTeamsByExternalId();

        return view('home')->with(["table" => $table, "matches" => Match::all(), "teamsByExtId" => $teamsByExtId]);
    }

    public function showTodayMatches()
    {
        $matches = Match::isDone('is_done', false)
                        ->orderBy("start_time")
                        ->get();

        $matches = $matches->filter(function (Match $match) {
            return $match->isClosedToBets();
        });
        $teamsByExtId = Team::getTeamsByExternalId();

        return view("matches-view")->with([
            "matches" => $matches,
            "teamsByExtId" => $teamsByExtId,
        ]);
    }

    public function showMyBets()
    {
        $matches = Match::query()->orderBy("id")->get();
        $user = Auth::user();
        $teams = Team::all();
        
        $userGroupBetsById = Bet::where('type', BetTypes::GroupsRank)
            ->where('user_id', $user->id)->get()
            ->groupBy('type_id')
            ->map(function($b){
                return $b->first();
            });
        $groups = Group::all();
        $groups->map(function($group) use($userGroupBetsById){
            $group->bet = $userGroupBetsById[$group->id] ?? null;
            return $group;
        });

        return view("my-bets-view")->with([
            "matches" => $matches,
            "user" => $user,
            "groups" => $groups,
            "teams" => $teams,
        ]);
    }



    /**
     * Return Matches with no user's bet
     *
     * @return \Illuminate\Http\Response
     */
    public function showOpenMatches()
    {
        /** @var User $user */
        $user = Auth::user();
        $matches = $user->getOpenMatches();
        $teamsByExtId = Team::getTeamsByExternalId();


        return view("open-matches-view")->with([
            "matches" => $matches,
            "user" => $user,
            "teamsByExtId" => $teamsByExtId
        ]);

    }

    /**
     * Return Open Special Bets
     *
     * @return \Illuminate\Http\Response
     */
    public function showOpenSpecialBets()
    {
        /** @var User $user */
        $user = Auth::user();
        $bets = $user->getSpecialBetsById();
        return view("open-special-bets-view")->with(["bets" => $bets, "user" => $user]);

    }


    /**
     * Return Group Bets with no user's bet
     *
     * @return \Illuminate\Http\Response
     */
    public function showOpenGroupBets()
    {
        /** @var User $user */
        $user = Auth::user();
        $groupsByExternalId = Group::all(['external_id', 'name', 'id'])->groupBy('external_id')
        ->map(function($collection){
            return $collection->first();
        });
        $currentBetsById = $user->getGroupBetsById();
        $groupsTeamsData = Team::all()->groupBy('group_id')->values()
        ->map(function($teams){
            return [
                'group_id' => $teams->first()->group_id,
                'teams' => $teams
            ];
        })
        ->sortBy(function($groupData) use($groupsByExternalId, $currentBetsById){
            $group = $groupsByExternalId[data_get($groupData, 'group_id')];
            $groupRankBet = $currentBetsById[$group->id]->bet;
            $hasData = $groupRankBet !== null;
            return $hasData;
        });
        $teamsById = Team::getTeamsById();
        return view("open-group-bets-view")->with([
            "user" => $user,
            'groupsTeamsData' => $groupsTeamsData,
            "currentBetsById" => $currentBetsById,
            "teamsById" => $teamsById,
            "groupsByExternalId" => $groupsByExternalId,
        ]);

    }

    /**
     * Return Group Bets 
     *
     * @return \Illuminate\Http\Response
     */
    public function showAllGroupBets()
    {
        /** @var User $user */
        $usersById = User::all()->groupBy('id')->map(
            function($coll){return $coll->first();}
        );
        $betsByUserId = Bet::where("type", BetTypes::GroupsRank)->get()
            ->groupBy('user_id');
        $groups = Group::all()
        ->map(function($group){
            $group->teams = Team::where('group_id', $group->external_id)->get();
            return $group;
        });
        $usersWhoBet = [];
        foreach($betsByUserId as $user_id => $bets){
            $user = $usersById[$user_id];
            $user->bets = $bets;
            array_push($usersWhoBet, $user);
        }
        return view("all-group-bets-view")->with([
            "usersWhoBet" => $usersWhoBet,
            "groups" => $groups,
        ]);

    }

    /**
     * Return Special Bets
     *
     * @return \Illuminate\Http\Response
     */
    public function showAllSpecialBets()
    {
        /** @var User $user */
        $usersById = User::all(['name', 'id'])->groupBy('id')->map(
            function($coll){return $coll->first();}
        );
        $bets = Bet::where("type", BetTypes::SpecialBet)->get()
            ->map(function($bet) use($usersById){
                $bet->user;
                return $bet;
            });
        $specialBets = SpecialBet::all();
        return view("all-special-bets-view")->with([
            "bets" => $bets,
            "specialBets" => $specialBets,
        ]);

    }

}
