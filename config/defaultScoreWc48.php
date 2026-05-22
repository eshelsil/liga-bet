<?php

// Overrides on top of config/defaultScore.php for 48-team WC format (R32 round).
// Merged via array_replace_recursive in CreateTournament when
// competition->getCompetitionType() == Competition::TYPE_WC_48.

return [
    "gameBets" => [
        "bonuses" => [
            "quarterFinal" => [
                "qualifier"  => 0,
                "winnerSide" => 0,
                "result"     => 1,
            ],
        ],
    ],
    "specialBets" => [
        "winner" => [
            "last16" => 2,
        ],
        "runnerUp" => [
            "last16" => 2,
        ],
    ],
];
