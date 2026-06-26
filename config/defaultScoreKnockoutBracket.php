<?php

/**
 * Default scoring template for the "knockout_bracket" tournament type.
 * See docs/knockout-bracket/CONTRACTS.md (contract F) and KNOCKOUT_BRACKET_PLAN.md.
 *
 * Rule: when a team qualifies the user earns the qualifier points AND, if that team
 * is their pre-selected Winner/Runner-Up, the specialAdvance points for that round.
 * The 3rd-place game awards qualifier points only.
 */
return [
    "bracket" => [
        // user's qualifier pick correct, per round
        "qualifier" => [
            "LAST_32"        => 1,
            "LAST_16"        => 2,
            "QUARTER_FINALS" => 4,
            "SEMI_FINALS"    => 8,
            "FINAL"          => 16,
            "THIRD_PLACE"    => 4,
        ],
        // user's pre-selected Winner/Runner-Up qualifies, per round (no 3rd place)
        "specialAdvance" => [
            "LAST_32"        => 1,
            "LAST_16"        => 2,
            "QUARTER_FINALS" => 4,
            "SEMI_FINALS"    => 8,
            "FINAL"          => 16,
        ],
    ],
    // Only Winner & Runner-Up are active for bracket tournaments.
    "specialQuestionFlags" => [
        "winner"   => true,
        "runnerUp" => true,
    ],
];
