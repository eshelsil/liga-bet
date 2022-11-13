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
    private ?\Illuminate\Support\Collection $fakeScorers = null;

    public function __construct(private readonly CalculateSpecialBets $calculateSpecialBets) { }


    public function fake(?\Illuminate\Support\Collection $scorers = null)
    {
        $this->fakeScorers = $scorers;
    }

    public function handle(Competition $competition, ?Collection $teams = null)
    {
        $teams ??= $competition->teams;
        $scorers = $this->fakeScorers ?? $competition->getCrawler()->fetchScorers($teams->pluck("external_id"));

        $players = $competition->players->keyBy("external_id");
        /** @var \App\DataCrawler\Player $scorer */
        foreach ($scorers as $scorer) {
            /** @var Player $player */
            $player = $players->get($scorer->externalId);
            \Log::debug("[UpdateScorers][handle] updating player ID [{$player->id}] external [{$scorer->externalId}] to G{$scorer->goals}A{$scorer->assists}");
            // TODO: Create?
            if ($player) {
                $player->goals   = $scorer->goals   ?? $player->goals;
                $player->assists = $scorer->assists ?? $player->assists;
                $player->save();
            }
        }

        $competition->unsetRelation("players");

        $answer = $competition->getTopScorersIds()->join(",") ?: null;
        $this->calculateSpecialBets->execute($competition->id, SpecialBet::TYPE_TOP_SCORER, $answer);

        $answer = $competition->getMostAssistsIds()->join(",") ?: null;
        $this->calculateSpecialBets->execute($competition->id, SpecialBet::TYPE_MOST_ASSISTS, $answer);
    }
}