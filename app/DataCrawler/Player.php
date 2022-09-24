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
        public readonly ?int $shirt,
        public readonly ?string $position,
        public readonly ?int $goals = null,
        public readonly ?int $assists = null,
    ) { }
}