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
        Log::debug('path '.$path);
        Log::debug('fullpath '.route('login').$search);
        return route('login').$search;
    }
}