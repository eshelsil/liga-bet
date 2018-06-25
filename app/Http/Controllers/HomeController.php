<?php

namespace App\Http\Controllers;

use App\Match;
use App\User;
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
        foreach ($table as $user) {
            $user->rank = $rank;
            $rank++;
        }

        return view('home')->with(["table" => $table, "matches" => Match::all()]);
    }

    public function showTodayMatches()
    {
        $matches = Match::query()->whereNull("result_home")->orderBy("start_time")->get();

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

}
