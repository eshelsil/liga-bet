<?php

namespace App\Enums;

final class BetTypes extends AbstractEnum {
    private function __construct() { }

    const Game           = 1;
    const StagesPosition = 2;
    const Winner         = 3;
    const FinalTeams     = 4;

    protected static $aliases = [
        BetTypes::Game           => "Game",
        BetTypes::StagesPosition => "StagesPosition",
        BetTypes::Winner         => "Winner",
        BetTypes::FinalTeams     => "FinalTeams",
    ];
}