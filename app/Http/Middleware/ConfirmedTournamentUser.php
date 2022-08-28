<?php

namespace App\Http\Middleware;

use Closure;
use App\Exceptions\JsonException;

class ConfirmedTournamentUser
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
        if (!\Auth::user()->isConfirmed($tournamentId)) {
            throw new JsonException("המשתמש לא אושר על ידי מנהל הטורניר", 401);

        }
        return $next($request);
    }
}
