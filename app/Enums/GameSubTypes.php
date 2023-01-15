<?php

namespace App\Enums;

final class GameSubTypes extends AbstractEnum {
    private function __construct() { }

    const FINAL          = "FINAL";
    const THIRD_PLACE    = "THIRD_PLACE";
    const SEMI_FINALS    = "SEMI_FINALS";
    const QUARTER_FINALS = "QUARTER_FINALS";
    const LAST_16        = "LAST_16";
    const LAST_32        = "LAST_32";

    protected static $aliases = [
        GameSubTypes::FINAL          => "FINAL",
        GameSubTypes::SEMI_FINALS    => "SEMI_FINALS",
        GameSubTypes::QUARTER_FINALS => "QUARTER_FINALS",
        GameSubTypes::LAST_16        => "LAST_16",
        GameSubTypes::LAST_32        => "LAST_32",
    ];
}