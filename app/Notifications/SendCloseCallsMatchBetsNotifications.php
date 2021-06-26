<?php

namespace App\Notifications;

use App\Enums\BetTypes;
use App\Match;
use App\Team;
use App\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SendCloseCallsMatchBetsNotifications
{
    const _CACHE_KEY_CLOSE_CALLS_BETS = "closeCallsBets";

    public function sendNotifications()
    {
        $closeCallMatches = Match::query()
            ->isDone(false)
            ->where("start_time", "<", now()->addMinutes(15)->format("U"))
            ->get();

        if ($closeCallMatches->isEmpty()) {
            Log::debug("[SendCloseCallsMatches] Got Empty games");

            return;
        }
        $teams = Team::query()
            ->whereIn("external_id", $closeCallMatches->pluck("team_home_id")
                    ->concat($closeCallMatches->pluck("team_away_id"))
            )->get()
             ->keyBy("external_id");



        Log::debug("[SendCloseCallsMatches] Got Following games: " .$closeCallMatches->map(function (Match $match) use ($teams) {
            return $teams->get($match->team_home_id)->id . " - " . $teams->get($match->team_home_id)->name
                   . " vs " .
                   $teams->get($match->team_away_id)->id . " - " . $teams->get($match->team_away_id)->name;
        })->implode(", "));

        $users = User::query()
            ->whereNotNull("fcm_token")
            ->with(["bets" => function ($q) use ($closeCallMatches) {
                    $q->where("type", BetTypes::Match)
                      ->whereIn("type_id", $closeCallMatches->pluck("id"));
                }
            ])
            ->get();

        $notifications = [];
        /** @var User $user */
        foreach ($users as $user) {
            $alreadySentMatchIdsStr = Cache::get(self::_CACHE_KEY_CLOSE_CALLS_BETS . ":u:" . $user->id, "[]");
            $alreadySentMatchIds = json_decode($alreadySentMatchIdsStr);

            Log::debug("[SendCloseCallsMatches] Checking user {$user->id}, with already sent: {$alreadySentMatchIdsStr}");

            $missingBetsMatches = $closeCallMatches->filter(function (Match $match) use ($user, $alreadySentMatchIds) {
                return ! $user->bets->contains("match_id", $match->id) && !in_array($match->id, $alreadySentMatchIds);
            })->sortBy("id");

            if ($missingBetsMatches->isEmpty()) {
                Log::debug("[SendCloseCallsMatches] Shouldn't send anything..");
                Cache::forget(self::_CACHE_KEY_CLOSE_CALLS_BETS . ":u:" . $user->id);
                continue;
            }

            $key = $missingBetsMatches->implode("id", ",");

            if ( ! array_key_exists($key, $notifications)) {
                $subject = "הזדמנות אחרונה לשליחת הימורי חברים";
                $body    = "עוד לא שלחת הימורים ל: " . $missingBetsMatches->map(function (Match $match) use ($teams) {
                        return $teams->get($match->team_home_id)->name . " נגד " . $teams->get($match->team_away_id)->name;
                    })->implode(", ");

                // Instantiate the push notification request object.
                $notifications[$key] = (new \Fcm\Push\Notification())
                    ->setClickAction("המר עכשיו")
                    ->setTitle($body)
                    ->setBody($subject);

                Log::debug("[SendCloseCallsMatches] Sending the following message: [{$body}] {$subject}");
            }

            $notifications[$key]->addRecipient($user->fcm_token);

            Cache::put(self::_CACHE_KEY_CLOSE_CALLS_BETS . ":u:" . $user->id, $missingBetsMatches->pluck("id")->toJson(), 60);
        }

        $client = app('FcmClient');

//        $req = (new \Fcm\Push\Notification())->setTitle("הזדמנות אחרונה לשליחת הימורי חברים")
//                                            ->setBody('Notification body')
//                                            ->addRecipient("cdIB29-oQGGetbv0p-9h9o:APA91bGJZAreJKUCi45eGL9XKT18oTf6kVYd2WRxzi8vCbM2vBIaYBEjy_evWAmggY5xnEXvzIEf6O4GQf7uhpVHNN0_3a198fGgoXRWzyTANWNtY48ndqMJJwlH-ZO3Gw_5i0IB8rkB");

        foreach ($notifications as $notification) {
            // custom sound and custom icon must be in app package
            //     - custom sound file must be in /res/raw/
            //     - custom icon file must be in drawable resource, if not set, FCM displays launcher icon in app manifest

            // Send the notification to the Firebase servers for further handling.
            $client->send($notification);
        }
    }
}