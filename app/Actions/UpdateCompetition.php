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
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;

class UpdateCompetition
{
    private CalculateSpecialBets $calculateSpecialBets;
    private UpdateCompetitionScorers $updateScorers;
    private UpdateCompetitionStandings $updateStandings;

    public static function aaa()
    {
        /** @var Competition $c */
        $c = Competition::find(1);
        $c->getCrawler()->fetchGames();

        $game = Game::query()->find(2);
        $game->forceFill(["result_home" => null, "result_away" => null])->save();
        $game->getBets()->toQuery()->update(["score" => 0]);

        $games = $c->getCrawler()->fetchGames();
        $games[1] = array_merge($games->get(1), [
            "is_done" => true,
            "result_home" => 2,
            "result_away" => 1
        ]);

        /** @var static $u */
        $u = app()->make(static::class);
        $u->handle($c, $games);
    }

    public function __construct(
        CalculateSpecialBets $calculateSpecialBets,
        UpdateCompetitionScorers $updateScorers,
        UpdateCompetitionStandings $updateStandings
    ) {
        $this->calculateSpecialBets = $calculateSpecialBets;
        $this->updateScorers = $updateScorers;
        $this->updateStandings = $updateStandings;
    }

    public function handle(Competition $competition, ?\Illuminate\Support\Collection $crawlerGames = null)
    {
        $crawler = $competition->getCrawler();
        $crawlerGames ??= $crawler->fetchGames();
        $existingGames = $competition->games;

        $this->saveNewGames($competition, $crawlerGames, $existingGames);

        $existingGamesWithNoScore = $existingGames->where("is_done", false)
            ->keyBy("external_id");

        $newScores = $crawlerGames->filter(function($crawlerGame) use ($existingGamesWithNoScore){
            return $crawlerGame['is_done'] && $existingGamesWithNoScore->has($crawlerGame['external_id']);
        });

        $hasNewGames = $this->saveNewScores($newScores, $existingGamesWithNoScore);

        if (!$newScores){
            $this->updateScorers->handle($competition);

            if (!$competition->hasAllGroupsStandings()) {
                $this->updateStandings->handle($competition);
            }
            if ($competition->isGroupStageDone()) {
                $this->calculateSpecialBets->execute($competition->id, ['offensive_team']);
            }
            Ranks::updateRanks();
        }

        return $hasNewGames;
    }

    /**
     * @param \Illuminate\Support\Collection $games
     * @param                                $existingMatches
     *
     * @return void
     */
    protected function saveNewGames(
        Competition $competition,
        \Illuminate\Support\Collection $games,
        $existingMatches
    ): void {
        $newGames = $games->filter(function ($game) use ($existingMatches) {
            return ! in_array($game['external_id'], $existingMatches->pluck('external_id')->toArray());
        });

        $autoBet = (new MonkeyAutoBetCompetitionGames());

        $teamsByExternalId = $competition->teams->pluck("id", "external_id");

        foreach ($newGames as $gameData) {
            $game                   = new Game();
            $game->competition_id   = $competition->id;
            $game->external_id      = $gameData['external_id'];
            $game->type             = $gameData['type'];
            $game->sub_type         = $gameData['sub_type'];
            $game->team_home_id     = $teamsByExternalId[$gameData['team_home_external_id']];
            $game->team_away_id     = $teamsByExternalId[$gameData['team_away_external_id']];
            $game->start_time       = $gameData['start_time'];

            Log::debug("Saving Game: " . $game->team_home_id . " vs. " . $game->team_away_id . "<br>");

            $game->save();
            User::getMonkeyUsers()->each(fn(User $monkey) => $autoBet->handle($monkey, $game));
        }
    }

    /**
     * @param \Illuminate\Support\Collection $newScores
     * @param Collection                          $gamesWithNoScore
     *
     * @return bool
     */
    protected function saveNewScores(
        \Illuminate\Support\Collection $newScores,
        Collection $gamesWithNoScore
    ): bool {
        $hasNewGames = false;
        foreach ($newScores as $gameData) {
            /** @var Game $game */
            $game = $gamesWithNoScore->get($gameData['external_id']);
            $game->result_home = $gameData['result_home'];
            $game->result_away = $gameData['result_away'];
            $game->ko_winner   = $gameData['ko_winner'];
            $game->save();

            $hasNewGames = true;
            Log::debug("Saving Result of Game: ext_id - " . $game->external_id . " | id - " . $game->id . "-> " . $game->result_home . " - " . $game->result_away);
            $game->completeBets();
            if ($game->isKnockout()) {
                $this->calculateSpecialBets->execute($game->competition_id, ['winner', 'runner_up']);
            }
        }

        return $hasNewGames;
    }
}