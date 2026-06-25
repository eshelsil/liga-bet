<?php

namespace App\Http\Middleware;

use Illuminate\Cookie\Middleware\EncryptCookies as Middleware;

class EncryptCookies extends Middleware
{
    /**
     * The names of the cookies that should not be encrypted.
     *
     * @var array
     */
    protected $except = [
        // Shared with the React frontend (read/written by JS), so it must stay
        // plaintext rather than Laravel-encrypted.
        'locale',
    ];
}
