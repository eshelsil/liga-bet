<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class SetLocale
{
    private const SUPPORTED = ['he', 'en'];
    private const FALLBACK = 'en';

    public function handle(Request $request, Closure $next)
    {
        App::setLocale($this->resolveLocale($request));

        return $next($request);
    }

    private function resolveLocale(Request $request): string
    {
        // 1. Explicit user choice (cookie) wins.
        $cookie = $request->cookie('locale');
        if (in_array($cookie, self::SUPPORTED, true)) {
            return $cookie;
        }

        // 2. Otherwise follow the browser: Hebrew if it's among the accepted
        //    languages, English for everything else.
        foreach ($request->getLanguages() as $language) {
            if (strtolower(substr($language, 0, 2)) === 'he') {
                return 'he';
            }
        }

        return self::FALLBACK;
    }
}
