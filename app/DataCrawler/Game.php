<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 19/11/2022
 * Time: 1:27
 */

namespace App\DataCrawler;

class Game
{
    public function __construct(
        public readonly string $externalId,
        public readonly string $type,
        public readonly string $subType,
        public readonly string $teamHomeExternalId,
        public readonly string $teamAwayExternalId,
        public ?int $startTime,
        public ?int $resultHome,
        public ?int $resultAway,
        public ?int $koWinnerExternalId,
        public bool $isDone,
        public bool $isStarted,
    ) { }

}