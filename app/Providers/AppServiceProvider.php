<?php

namespace App\Providers;

use Fcm\FcmClient;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;
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
            \URL::forceScheme('https');
        }
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('FcmClient', function ($app) {
            // Instantiate the client with the project api_token and sender_id.
            return new \Fcm\FcmClient(
                // TODO: Env vars
                    "AAAA0HFSolE:APA91bEuTxclSUzGDpTDSr8Hwd9yAu1puQHX-pVR2c_T7-AVPfkVDhkLbWipmCkQ7CwCPVv5Y7GEd3upMVIu_AicAaa7lTB03TGymKv3Q-l09cCPl1ltfgvaz-WvZx6ZfgCTAd2Eoztb",
                    895254438481
                );
        });
        App::terminating(function() {
            Log::debug("[Runtime][" . Request::method() . "] " . Request::getRequestUri() . " " .
                       (defined('LARAVEL_START') ? round((microtime(true) - LARAVEL_START), 4) : 0));
        });
    }
}
