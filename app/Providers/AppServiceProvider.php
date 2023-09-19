<?php

namespace App\Providers;

use Fcm\FcmClient;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        \Illuminate\Database\Schema\Builder::defaultStringLength(191);
        if(config('app.env') === 'production') {
            URL::forceScheme('https');
        }
        Paginator::useBootstrap();
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        App::terminating(function() {
            if (app()->runningInConsole()) {
                $method = "Console";
                $path = join(" ", $_SERVER['argv']);
            } else {
                $method = Request::method();
                $path = Request::getRequestUri();
            }

            $time = (defined('LARAVEL_START') ? round((microtime(true) - LARAVEL_START), 4) : 0);
            Log::debug("[Runtime][{$method}] {$path} {$time}");
        });
    }
}
