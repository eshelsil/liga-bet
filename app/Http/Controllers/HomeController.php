<?php

namespace App\Http\Controllers;

use App\Game;
use App\Ranks;
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
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class HomeController extends Controller
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function index()
    {
        $user = Auth::user();
        if (!$user->isConfirmed()){
            return  view('home')->with(["show_table" => false]);
        }

        $bets = Bet::query()->get()->groupBy("user_id");

        $table = Ranks::query()->latest()->first()->getData();
        $summary_msg = $this->getSummaryMessage($table);
        foreach ($table as $row) {
            $row->betsByType = $bets->get($row->id, collect())->groupBy("type");
        }

        $teamsByExtId = Team::getTeamsByExternalId();

        return view('home')->with([
            "table" => $table,
            "matches" => Game::all(),
            "teamsByExtId" => $teamsByExtId,
            "summary_msg" => $summary_msg,
        ]);
    }

    public function summaryMessageSeen()
    {
        $user_id = Auth::user()->id;
        Cache::put("TOURNAMENT_SUMMARY_MESSAGE". ":u_id:" . $user_id, "seen", now()->addMinutes(60));
    }

    private function getSummaryMessage($rankTable)
    {   

        if ( !Game::isTournamentDone() || !SpecialBet::hasAllCustomAnswers()){
            return null;
        }
        $user_id = Auth::user()->id;
        if (Cache::get("TOURNAMENT_SUMMARY_MESSAGE". ":u_id:" . $user_id)){
            return null;
        };
        $user_row = collect($rankTable)->first(function($row) use($user_id){
            return $row->id == $user_id;
        });
        if (!$user_row){
            return null;
        }
        $rank = $user_row->rank;
        if ($rank == 1){
            return "winner";
        } else if ($rank == 2){
            return "runner_up";
        } else if ($rank == 3){
            return "3rd";
        } else if ($rank == 4){
            return "4th";
        } else if ($rank == 5){
            return "almost_money";
        } else if (5 < $rank && $rank <= 7){
            return "bottom_of_top";
        } else if (7 < $rank && $rank <= 11){
            return "middle";
        } else if (11 < $rank && $rank <= 14){
            return "top_of_bottom";
        } else if ($rank == 15){
            return "almost_last";
        } else if ($rank == 16){
            return "last";
        }
        return null;
    }

    public function showTodayMatches()
    {
        $matches = Game::orderBy("start_time")
                       ->get();
        $matches = $matches->filter(function (Game $match) {
            return $match->isClosedToBets();
        })->groupBy('is_done');
        $done_matches = $matches[1] ?? collect([]);
        $done_matches = $done_matches->reverse();
        $onging_matches = $matches[0] ?? collect([]);
        $teamsByExtId = Team::getTeamsByExternalId();

        return view("matches-view")->with([
            "done_matches" => $done_matches,
            "current_matches" => $onging_matches,
            "teamsByExtId" => $teamsByExtId,
        ]);
    }

    public function showMyBets()
    {
        $matches = Game::query()->orderBy("id")->get();
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
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
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
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
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
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
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
        ->sortBy(function($groupData){
            return data_get($groupData, 'group_id');
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
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function showAllGroupBets()
    {
        /** @var User $user */
        $usersById = User::all()->keyBy('id');
        $betsByUserId = Bet::where("type", BetTypes::GroupsRank)
            ->get()
            ->groupBy('user_id');

        $groups = Group::all()
            ->map(function($group){
                $group->teams = Team::where('group_id', $group->external_id)->get();
                return $group;
            })
            ->sortBy('name');
        $usersWhoBet = [];
        foreach($betsByUserId as $userId => $bets){
            $user = $usersById[$userId];
            $user->bets = $bets;
            $usersWhoBet[] = $user;
        }
        return view("all-group-bets-view")->with([
            "usersWhoBet" => $usersWhoBet,
            "groups" => $groups,
        ]);

    }

    /**
     * Return Special Bets
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function showAllSpecialBets()
    {
        $bets = Bet::where("type", BetTypes::SpecialBet)->get();
        $specialBets = SpecialBet::all();
        return view("all-special-bets-view")->with([
            "bets" => $bets,
            "specialBets" => $specialBets,
        ]);

    }


    public function showTerms()
    {
        return view("takanon");
    }

    public function showArticles()
    {
        return view("articles");
    }

    public function registerFCMToken(Request $request) {
        Log::debug("[HomeController][registerFCMToken] Got request");

        /** @var User $user */
        if (!$user = $request->user()) {
            Log::debug("[HomeController][registerFCMToken] Got request");

            return redirect("/login?fcm-no-user=1");
        }
        $user->fcm_token = $request->getContent() ?: null;
        $user->save();

        return redirect("/home");
    }

}
