<?php

namespace App\DataCrawler;

/**
 * Parsed knockout bracket from 365scores /brackets — a flat list of ties. Pure DTO.
 */
class Bracket
{
    /**
     * @param BracketTie[] $ties
     */
    public function __construct(
        public readonly array $ties,
    ) { }
}
