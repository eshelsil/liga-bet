<?php

namespace App\Http\Middleware;

use App\Notifications\SendCloseCallsMatchBetsNotifications;
use Closure;
use Illuminate\Support\Facades\Cache;

class SendNotificationsMiddleware
{

    /** @var SendCloseCallsMatchBetsNotifications */
    protected $service;

    public function __construct(SendCloseCallsMatchBetsNotifications $service) {
        $this->service = $service;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (!Cache::get($this->service::_CACHE_KEY_CLOSE_CALLS_BETS)) {
            Cache::put($this->service::_CACHE_KEY_CLOSE_CALLS_BETS, 1, 1);
            $this->service->sendNotifications();
        }
        return $next($request);
    }
}
