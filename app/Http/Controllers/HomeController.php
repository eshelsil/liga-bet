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
    // public function index()
    // {
    //     $user = Auth::user();
    //     if (!$user->isConfirmed()){
    //         return  view('home')->with(["show_table" => false]);
    //     }

    //     $bets = Bet::query()->get()->groupBy("user_id");

    //     $table = Ranks::query()->latest()->first()->getData();
    //     $summary_msg = $this->getSummaryMessage($table);
    //     foreach ($table as $row) {
    //         $row->betsByType = $bets->get($row->id, collect())->groupBy("type");
    //     }

    //     return view('home')->with([
    //         "table" => $table,
    //         "matches" => Game::all(),
    //         "teamsByExtId" => $teamsByExtId,
    //         "summary_msg" => $summary_msg,
    //     ]);
    // }

    public function summaryMessageSeen()
    {
        $user_id = Auth::user()->id;
        Cache::put("TOURNAMENT_SUMMARY_MESSAGE". ":u_id:" . $user_id, "seen", now()->addMinutes(60));
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
