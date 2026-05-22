<?php

return [
    'path' => "https://api.football-data.org/v4/",
    'throttling_minutes' => env('API_THROTTLING_MINUTES', 5),
    'api_token' => env('FOOTBALL_DATA_API_TOKEN'),
    'api_token_2' => env('FOOTBALL_DATA_API_TOKEN_2'),
];
