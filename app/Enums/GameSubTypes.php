<?php

namespace App\Enums;

final class GameSubTypes extends AbstractEnum {
    private function __construct() { }

    const FINAL          = "FINAL";
    const SEMI_FINALS    = "SEMI_FINALS";
    const QUARTER_FINALS = "QUARTER_FINALS";

    protected static $aliases = [
        GameSubTypes::FINAL          => "FINAL",
        GameSubTypes::SEMI_FINALS    => "SEMI_FINALS",
        GameSubTypes::QUARTER_FINALS => "QUARTER_FINALS",
    ];
}