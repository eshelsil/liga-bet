<?php
/**
 * Created by PhpStorm.
 * User: Omer
 * Date: 02/07/18
 * Time: 19:28
 */

return [

    /*
    |--------------------------------------------------------------------------
    | Default Broadcaster
    |--------------------------------------------------------------------------
    |
    | This option controls the default broadcaster that will be used by the
    | framework when an event needs to be broadcast. You may set this to
    | any of the connections defined in the "connections" array below.
    |
    | Supported: "pusher", "redis", "log", "null"
    |
    */

    'lockBeforeSeconds' => 60*60*env('BETS_LOCK_BET_BEFORE_HOURS', 3),


];
