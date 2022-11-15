<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Log;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        $path = $request->path();
        $search = in_array($path, ['', '/']) ? '' : "?redirectTo=$path";
        $targetRoute = route('login');
        if(preg_match("/join-tournament\/\w{6}/", $path)) {
            $targetRoute = route('welcome');
        }
        return $targetRoute.$search;
    }
}