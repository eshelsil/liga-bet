<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 23/07/2022
 * Time: 20:13
 */

namespace App\Actions;

use App\Competition;
use App\Player;
use App\SpecialBets\SpecialBet;
use Illuminate\Database\Eloquent\Collection;

class UpdateCompetitionScorers
{
    private CalculateSpecialBets $calculateSpecialBets;

    public function __construct(CalculateSpecialBets $calculateSpecialBets) {
        $this->calculateSpecialBets = $calculateSpecialBets;
    }

    public function handle(Competition $competition, ?Collection $teams = null)
    {
        $teams ??= $competition->teams;
        $scorers = $competition->getCrawler()->fetchScorers($teams->pluck("external_id"));

        $players = $competition->players->keyBy("external_id");
        /** @var \App\DataCrawler\Player $scorer */
        foreach ($scorers as $scorer) {
            /** @var Player $player */
            $player = $players->get($scorer->externalId);
            $player->goals   = $scorer->goals   ?? $player->goals;
            $player->assists = $scorer->assists ?? $player->assists;
            $player->save();
        }

        $answer = $competition->getTopScorersIds()->join(",") ?: null;

        $this->calculateSpecialBets->execute($competition->id, SpecialBet::TYPE_TOP_SCORER, $answer);
    }
}