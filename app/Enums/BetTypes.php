<?php

namespace App\Enums;

final class BetTypes extends AbstractEnum {
    private function __construct() { }

    const Match          = 1;
    const GroupsRank     = 2;
    const Winner         = 3;
    const FinalTeams     = 4;

    protected static $aliases = [
        BetTypes::Match          => "Match",
        BetTypes::GroupsRank     => "GroupsRank",
        BetTypes::Winner         => "Winner",
        BetTypes::FinalTeams     => "FinalTeams",
    ];
}