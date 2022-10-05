<?php

namespace App\Http\Middleware;

use App\Exceptions\JsonException;
use Closure;
use App\Tournament;

class PreTournamentBetsClosedMiddleware
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
        $tournament = Tournament::find($tournamentId);
        // if (!$tournament->competition->areBetsOpen()) { // for development
        if ($tournament->competition->areBetsOpen()) {
            throw new JsonException('Cannot see other users bets cefore tournament has started', 403);
        }
        return $next($request);
    }
}
