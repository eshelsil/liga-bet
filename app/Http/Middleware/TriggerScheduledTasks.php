<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Artisan;

class TriggerScheduledTasks
{
    public function handle(Request $request, Closure $next)
    {
        // Let the request finish first, then run the check after the response is sent.
        return $next($request);
    }

    public function terminate(Request $request, $response)
    {
        $interval = 60; // seconds
        $lastRun = Cache::get('liga_bet_last_run');

        if ($lastRun && now()->diffInSeconds($lastRun) < $interval) {
            return; // not enough time passed
        }

        // Atomic lock: only one request wins, even if several arrive at once.
        $lock = Cache::lock('liga_bet_run_lock', 30);

        if ($lock->get()) {
            try {
                Cache::put('liga_bet_last_run', now(), now()->addMinutes(10));
                Artisan::call('liga-bet:update-running-competitions');
            } finally {
                $lock->release();
            }
        }
    }
}