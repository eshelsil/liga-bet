<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 10/07/2022
 * Time: 1:27
 */

namespace App\Actions;

use App\Competition;
use App\DataCrawler\Crawler;
use App\Group;
use App\Game;
use App\Ranks;
use App\Scorer;
use App\SpecialBets\SpecialBet;
use App\Team;
use App\User;
use Illuminate\Support\Facades\Log;

class UpdateCompetition
{
    private CalculateSpecialBets $calculateSpecialBets;
    private UpdateCompetitionScorers $updateScorers;
    private UpdateCompetitionStandings $updateStandings;

    public function __construct(
        CalculateSpecialBets $calculateSpecialBets,
        UpdateCompetitionScorers $updateScorers,
        UpdateCompetitionStandings $updateStandings
    ) {
        $this->calculateSpecialBets = $calculateSpecialBets;
        $this->updateScorers = $updateScorers;
        $this->updateStandings = $updateStandings;
    }

    public function handle(Competition $competition)
    {
        $crawler = $competition->getCrawler();
        $matches = $crawler->fetchGames();
        $existingMatches = $competition->games;

        $this->saveNewGames($matches, $existingMatches);

        $gamesWithNoScore = $existingMatches->where("is_done", false)
            ->keyBy->external_id;

        $newScores = $matches->filter(function($m) use ($gamesWithNoScore){
            $id = data_get($m, 'id');
            return data_get($m, 'is_done') && in_array($id, $gamesWithNoScore->pluck('external_id')->toArray());
        });

        foreach ($newScores as $gameData)  {
            /** @var Game $game */
            $game = $gamesWithNoScore->get(data_get($gameData, 'id'));
            $game->result_home  = data_get($gameData, 'result_home');
            $game->result_away  = data_get($gameData, 'result_away');
            $game->ko_winner    = data_get($gameData, 'ko_winner');
            $game->save();

            $this->user_fetch_got_games = true;
            Log::debug("Saving Result of Game: ext_id - ".$game->external_id." | id - ".$game->id."-> ".$game->result_home." - ".$game->result_away);
            $game->completeBets();
            if ($game->isKnockout()){
                $this->calculateSpecialBets->execute($game->competition_id, ['winner', 'runner_up']);
            }
        }

        if (count($newScores) > 0){
            $this->updateScorers->handle($competition);

            if (!$competition->hasAllGroupsStandings()) {
                $this->updateStandings->handle($competition);
            }
            if ($competition->isGroupStageDone()) {
                $this->calculateSpecialBets->execute($competition->id, ['offensive_team']);
            }
            Ranks::updateRanks();
        }
    }

    /**
     * @param \Illuminate\Support\Collection $games
     * @param                                $existingMatches
     *
     * @return void
     */
    protected function saveNewGames(
        \Illuminate\Support\Collection $games,
        $existingMatches
    ): void {
        $newGames = $games->filter(function ($m) use ($existingMatches) {
            return ! in_array($m['id'], $existingMatches->pluck('external_id')->toArray());
        });

        $autoBet = (new MonkeyAutoBetCompetitionGames());

        foreach ($newGames as $gameData) {
            $game               = new Game();
            $game->external_id  = data_get($gameData, 'id');
            $game->type         = data_get($gameData, 'type');
            $game->sub_type     = data_get($gameData, 'sub_type');
            $game->team_home_id = data_get($gameData, 'team_home_id');
            $game->team_away_id = data_get($gameData, 'team_away_id');
            $game->start_time   = data_get($gameData, 'start_time');

            Log::debug("Saving Game: " . $game->team_home_id . " vs. " . $game->team_away_id . "<br>");

            $game->save();
            User::getMonkeyUsers()->each(fn(User $monkey) => $autoBet->handle($monkey, $game));
        }
    }
}