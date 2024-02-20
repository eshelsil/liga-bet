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
        public ?int $fullResultHome,
        public ?int $fullResultAway,
        public ?int $totalResultHome, // result + ?extraTime + ?penalties
        public ?int $totalResultAway, // result + ?extraTime + ?penalties
        public ?int $koWinnerExternalId,
        public ?string $koLeg,
        public bool $isDone,
        public bool $isStarted,
    ) { }

}