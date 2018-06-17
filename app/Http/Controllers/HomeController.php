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

        return view('home')->with(["table" => $table]);
    }

    public function showTodayMatches()
    {
        $matches = Match::query()->whereNull("result_home")->orderBy("start_time")->take(5)->get();

        return view("matches-view")->with(["matches" => $matches]);
    }

    public function showMyBets()
    {
        $matches = Match::all();

        return view("my-bets-view")->with(["matches" => $matches, "user" => Auth::user()]);
    }
}
