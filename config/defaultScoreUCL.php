<?php

return [
    "gameBets" => [
        "bonuses" => [
            "final" => [
                "result" => 4,
                "qualifier" => 2,
                "winnerSide" => 2
            ],
            "semiFinal" => [
                "result" => 2,
                "qualifier" => 1,
                "winnerSide" => 1
            ]
        ],
        "knockout" => [
            "result" => 12,
            "qualifier" => 3,
            "winnerSide" => 3
        ],
        "groupStage" => [
            "result" => 4,
            "winnerSide" => 2
        ]
    ],
    "specialBets" => [
        "mvp" => 20,
        "winner" => [
            "final" => 20,
            "winning" => 30,
            "semiFinal" => 6,
            "quarterFinal" => 4
        ],
        "runnerUp" => [
            "final" => 20,
            "semiFinal" => 6,
            "quarterFinal" => 4
        ],
        "topScorer" => [
            "correct" => 8,
            "eachGoal" => 4
        ],
        "topAssists" => [
            "correct" => 8,
            "eachGoal" => 0
        ],
        "offensiveTeam" => 10
    ],
    "groupRankBets" => [
        "perfect" => 12,
        "minorMistake" => 6
    ],
    "specialQuestionFlags" => [
        "mvp" => true,
        "winner" => true,
        "runnerUp" => true,
        "topScorer" => true,
        "topAssists" => true,
        "offensiveTeam" => true
    ]
];