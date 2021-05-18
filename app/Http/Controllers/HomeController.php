<?php

namespace App\Http\Controllers;

use App\Match;
use App\User;
use App\Team;
use App\Group;
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
        $table = User::query()
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

        return view('home')->with(["table" => $table, "matches" => Match::all()]);
    }

    public function showTodayMatches()
    {
        $matches = Match::query()
                        ->whereNull("result_home")
                        ->orderBy("start_time")
                        ->get();

        $matches = $matches->filter(function (Match $match) {
            return $match->type == "groups" || $match->isClosedToBets();
        });

        return view("matches-view")->with(["matches" => $matches]);
    }

    public function showMyBets()
    {
        $matches = Match::query()->orderBy("id")->get();

        return view("my-bets-view")->with(["matches" => $matches, "user" => Auth::user()]);
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

        return view("open-matches-view")->with(["matches" => $matches, "user" => $user]);

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
        return view("open-group-bets-view")->with([
            "user" => $user,
            'groupsTeamsData' => $groupsTeamsData,
            "currentBetsById" => $currentBetsById,
            "groupsByExternalId" => $groupsByExternalId,
        ]);

    }

}
