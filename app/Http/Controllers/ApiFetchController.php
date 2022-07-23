<?php

namespace App\Http\Controllers;

use App\Ranks;
use Illuminate\Http\Request;
use App\DataCrawler\Crawler;
use Illuminate\Support\Facades\Cache;
use App\Game;
use App\Team;
use App\User;
use App\Group;
use App\SpecialBets\SpecialBet;
use App\Scorer;
use Log;

class ApiFetchController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
       $this->middleware("confirmed_user");
    }

    public function userUpdateGames() {
        $this->user_fetch_got_games = false;
        if ($blockEndAt = Cache::get("general_api_update")) {
            return response("SERVER_ERROR_MSG:". "עדכון תוצאות חסום מכיוון שכבר בוצעה קריאת עדכון ב5 הדקות האחרונות. יהיה ניתן לנסות לעדכן שוב בשעה:<br>{$blockEndAt}", 400);
        }
        if (!Game::hasOneWaitingForResult()){
            return response("SERVER_ERROR_MSG:". "לא בוצע עדכון מכיוון שאין משחקים שממתינים לתוצאות", 400);
        }
        try {
            $apiBlockageMinutes = config('api.throttling_minutes');
            Cache::put("general_api_update", now()->addMinutes($apiBlockageMinutes)->format("Y-m-d H:i:s"), now()->addMinutes($apiBlockageMinutes));
            $this->fetchGames(true);
        } catch (\Throwable $e) {
            Cache::forget("general_api_update");
            return response("SERVER_ERROR_MSG:".$e->getMessage(), 500);
        }
        if (!$this->user_fetch_got_games){
            $error_msg = "למשחקים שעבורם נדרש עדכון עדיין אין תוצאות זמינות";
            return response("SERVER_ERROR_MSG:".$error_msg, 400);
        }
        $success_msg = "העדכון בוצע בהצלחה";
        return response("SERVER_SUCCESS_MSG:".$success_msg, 200);
    }

}
