<?php

namespace App\Enums;

final class BetTypes extends AbstractEnum {
    private function __construct() { }

    const Match           = 1;
    const StagesPosition = 2;
    const Winner         = 3;
    const FinalTeams     = 4;

    protected static $aliases = [
        BetTypes::Match          => "Match",
        BetTypes::StagesPosition => "StagesPosition",
        BetTypes::Winner         => "Winner",
        BetTypes::FinalTeams     => "FinalTeams",
    ];
}