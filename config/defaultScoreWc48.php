<?php

// Overrides on top of config/defaultScore.php for 48-team WC format (R32 round).
// Merged via array_replace_recursive in CreateTournament when
// competition->getCompetitionType() == Competition::TYPE_WC_48.

return [
    "gameBets" => [
        "bonuses" => [
            "quarterFinal" => [
                "qualifier"  => 1,
                "winnerSide" => 1,
                "result"     => 2,
            ],
        ],
    ],
];
