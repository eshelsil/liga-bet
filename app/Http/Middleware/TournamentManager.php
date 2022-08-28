<?php

namespace App\Http\Middleware;

use Closure;
use JsonException;

class TournamentManager
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
        $tournamentId = $request->route('tournamentId');
        $utl = \Auth::user()->getTournamentUser($tournamentId);
        if (!$utl || !$utl->hasManagerPermissions()) {
            throw new JsonException("You need to have manager permissions for this tournament to access this resource", 403);
        }
        return $next($request);
    }
}
