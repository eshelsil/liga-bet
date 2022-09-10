<?php

namespace App\Http\Middleware;

use App\Http\Validations\EnsureTournamentAdmin;
use Closure;

class TournamentAdmin
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
        $user = \Auth::user();
        EnsureTournamentAdmin::validate($user, $tournamentId);
        return $next($request);
    }
}
