<?php

return [
    "gameBets" => [
        "groupStage" => [
            "winnerSide"         => 2,
            "result"             => 6,
        ],
        "knockout" => [
            "qualifier"          => 3,
            "winnerSide"         => 3,
            "result"             => 12,
        ],
        "bonuses" => [
            "final" => [
                "qualifier"      => 3,
                "winnerSide"     => 3,
                "result"         => 8,

            ],
            "semiFinal" => [
                "qualifier"      => 2,
                "winnerSide"     => 2,
                "result"         => 4,
            ],
        ],
    ],
    "groupRankBets" => [
        "perfect"                => 12,
        "minorMistake"           => 6,
    ],
    "specialBets" => [
        "offensiveTeam"          => 10,
        "winner" => [
            "quarterFinal"       => 5,
            "semiFinal"          => 10,
            "final"              => 20,
            "winning"            => 35,
        ],
        "runnerUp" => [
            "quarterFinal"       => 5,
            "semiFinal"          => 10,
            "final"              => 20,

        ],
        "mvp"                    => 20,
        "topAssists"             => [
            "correct"     => 10,
            "eachGoal"    => 4,
        ],
        "topScorer" => [
            "correct"            => 12,
            "eachGoal"           => 4,
        ],
    ],
    "specialQuestionFlags" => [
        "winner"                 => true,
        "runnerUp"               => true,
        "topScorer"              => true,
        "mvp"                    => true,
        "topAssists"             => true,
        "offensiveTeam"          => true,
    ],
];
