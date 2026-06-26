<?php

namespace App\DataCrawler;

/**
 * Parsed knockout tie from 365scores /brackets — maps 1:1 to a bracket_games row. Pure DTO.
 */
class BracketTie
{
    public function __construct(
        public readonly int $stageNum,
        public readonly int $groupNum,
        public readonly string $subType,        // GameSubTypes value
        public readonly ?string $matchLabel,     // "Match 74"
        public readonly ?int $startTime,
        public readonly ?string $external365GameId,
        public readonly BracketSource $home,
        public readonly BracketSource $away,
        public readonly ?int $destStageNum,
        public readonly ?int $destGroupNum,
    ) { }
}
