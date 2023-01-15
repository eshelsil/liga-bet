<?php

namespace Tests;

use Carbon\Carbon;

class TimeUtils
{

    const START_DATE = '2022-12-18';
    // const START_DATE = '2022-12-09';
    // const START_DATE = '2022-11-19';
    // const START_DATE = '2022-11-20';
    const START_HOUR = 21;

    static function time(): int
    {
        return self::now()->timestamp;
    }

    static function now(): Carbon
    {
        return Carbon::createFromFormat('Y-m-d', self::START_DATE)->startOfDay()->addHours(self::START_HOUR);
    }
}
