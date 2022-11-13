<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 28/08/2022
 * Time: 2:10
 */

namespace App\DataCrawler;

class Player
{
    public function __construct(
        public readonly string $externalId,
        public readonly string $name,
        public readonly string $externalTeamId,
        public readonly ?int $shirt = null,
        public readonly ?string $position = null,
        public ?int $goals = null,
        public ?int $assists = null,
    ) { }

    /**
     * @param int|null $goals
     */
    public function setGoals(?int $goals): void
    {
        $this->goals = $goals;
    }

    /**
     * @param int|null $assists
     */
    public function setAssists(?int $assists): void
    {
        $this->assists = $assists;
    }
}