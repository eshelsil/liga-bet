<?php

return [

    'lockBeforeSeconds' => 60*60*env('BETS_LOCK_BET_BEFORE_HOURS', 3),
    'lockBetsBeforeTournamentSeconds' => 60*60*env('BETS_LOCK_BETS_BEFORE_TOURNAMENT_HOURS', 22),
    'mvp' => env('MVP', null),
    'topAssists' => env('TOP_ASSISTS_PLAYER', null),
];