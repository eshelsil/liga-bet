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

    public function summaryMessageSeen()
    {
        $user_id = Auth::user()->id;
        Cache::put("TOURNAMENT_SUMMARY_MESSAGE". ":u_id:" . $user_id, "seen", now()->addMinutes(60));
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
