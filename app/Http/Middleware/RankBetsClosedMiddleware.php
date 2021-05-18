<?php

namespace App\Http\Middleware;

use Closure;
use App\Group;

class RankBetsClosedMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (Group::areBetsOpen()) {
            return response('Cannot see other users bet while bets are still open', 403);
        }
        return $next($request);
    }
}
