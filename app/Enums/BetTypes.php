<?php

namespace App\Enums;

final class BetTypes extends AbstractEnum {
    private function __construct() { }

    const Match          = 1;
    const GroupsRank     = 2;
    const SpecialBet     = 3;

    protected static $aliases = [
        BetTypes::Match          => "Match",
        BetTypes::GroupsRank     => "GroupsRank",
        BetTypes::SpecialBet     => "SpecialBet",
    ];
}