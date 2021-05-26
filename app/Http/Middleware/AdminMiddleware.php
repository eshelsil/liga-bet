<?php

namespace App\Http\Middleware;

use Closure;
use App\User;

class AdminMiddleware
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
        $user = \Auth::user();
        if ( !$user || $user->permissions !== User::TYPE_ADMIN) {
            return redirect('/home');
        }
        return $next($request);
    }
}
