<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 23/07/2022
 * Time: 20:13
 */

namespace App\Actions;

use App\Competition;
use App\Game;
use App\Player;
use App\SpecialBets\SpecialBet;
use Illuminate\Database\Eloquent\Collection;

class UpdateCompetitionScorers
{
    private ?\Illuminate\Support\Collection $fakeScorers = null;

    public function __construct(private readonly CalculateSpecialBets $calculateSpecialBets,
        private readonly UpdateLeaderboards $updateLeaderboards,
        private readonly SavePleyerGameGoalsData $savePleyerGameGoalsData,
    ) { }


    public function fake(?\Illuminate\Support\Collection $scorers = null)
    {
        $this->fakeScorers = $scorers;
    }

            
    public function handle(Competition $competition)
    {
        $relevantGames = $competition->games->whereBetween('start_time', [now()->subHours(24)->timestamp, now()->timestamp]);
        $teams = new Collection();
        $relevantGames->load(["teamHome", "teamAway"])
            ->each(fn(Game $g) => $teams->add($g->teamHome)->add($g->teamAway));
        $scorers = $this->fakeScorers ?? $competition->getCrawler()->fetchScorers($teams->pluck("external_id"));
        \Log::debug("[UpdateScorers][handle] got {{$scorers->count()}} scorers", );

        $players = $competition->players->keyBy("external_id");
        $newGoalsAndAssistsData = [];
        /** @var \App\Game $game */
        $hasDoneGames = false;
        /** @var \App\DataCrawler\Player $scorer */
        foreach ($scorers as $scorer) {
            /** @var Player $player */
            $player = $players->get($scorer->externalId);
            \Log::debug("[UpdateScorers][handle] updating player ID [{$player->id}] external [{$scorer->externalId}] to G{$scorer->goals}A{$scorer->assists}");
            // TODO: Create?
            if ($player) {
                
                $game = $relevantGames->first(fn($g) => in_array($player->team_id, [$g->team_home_id, $g->team_away_id]));
                $gameId = $game->id;

                if (!is_null($scorer->goals) || !is_null($scorer->assists)){
                    $this->savePleyerGameGoalsData->handle($player->id, $gameId, $scorer->goals ?? 0, $scorer->assists ?? 0);
                }

                if ($game->is_done){
                    $hasDoneGames = true;
                    $goalsDiff = $scorer->goals - $player->goals;
                    $assistsDiff = $scorer->assists - $player->assists;
                    $hasGoalsChange = !is_null($scorer->goals) && $goalsDiff != 0;
                    $hasAssistsChange = !is_null($scorer->assists) && $assistsDiff != 0;
                    if (($hasGoalsChange || $hasAssistsChange) && !array_key_exists($gameId, $newGoalsAndAssistsData)){
                        $newGoalsAndAssistsData[$gameId] = [
                            "scorers" => [],
                            "assists" => [],
                        ];
                    }
                    if ($hasGoalsChange){
                        $newGoalsAndAssistsData[$gameId]["scorers"][$player->id] = $goalsDiff;
                    }
                    if ($hasAssistsChange){
                        $newGoalsAndAssistsData[$gameId]["assists"][$player->id] = $assistsDiff;
                    }
                    $player->goals   = $scorer->goals   ?? $player->goals;
                    $player->assists = $scorer->assists ?? $player->assists;
                    $player->save();
                }
            }
        }

        if ($hasDoneGames) {
            $competition->unsetRelation("players");
            $answer = $competition->getTopScorersIds()->join(",") ?: null;
            $this->calculateSpecialBets->execute($competition->id, SpecialBet::TYPE_TOP_SCORER, $answer);
            $answer = $competition->getMostAssistsIds()->join(",") ?: null;
            $this->calculateSpecialBets->execute($competition->id, SpecialBet::TYPE_MOST_ASSISTS, $answer);
    

            $this->updateLeaderboards->handleNewScorersData($competition, collect($newGoalsAndAssistsData));
        }

    }
}