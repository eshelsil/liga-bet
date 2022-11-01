<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 10/07/2022
 * Time: 1:27
 */

namespace App\Actions;

use App\Competition;
use App\Game;
use App\SpecialBets\SpecialBet;
use App\User;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class UpdateCompetition
{
    private CalculateSpecialBets $calculateSpecialBets;
    private UpdateCompetitionScorers $updateScorers;
    private UpdateCompetitionStandings $updateStandings;
    private UpdateGameBets $updateGameBets;
    private UpdateLeaderboards $updateLeaderboards;

    public static function aaa()
    {
        $game = Game::query()->find(2);
        $game->forceFill(["result_home" => null, "result_away" => null])->save();
        $game->getBets()->toQuery()->update(["score" => 0]);

        $games = $game->competition->getCrawler()->fetchGames();
        $games[1] = array_merge($games[1], [
            "is_done" => true,
            "result_home" => 1,
            "result_away" => 2
        ]);

        /** @var static $u */
        $u = app()->make(static::class);
        $u->handle($game->competition, $games);
    }

    public function __construct(
        CalculateSpecialBets $calculateSpecialBets,
        UpdateCompetitionScorers $updateScorers,
        UpdateCompetitionStandings $updateStandings,
        UpdateGameBets $updateGameBets,
        UpdateLeaderboards $updateLeaderboards
    ) {
        $this->calculateSpecialBets = $calculateSpecialBets;
        $this->updateScorers = $updateScorers;
        $this->updateGameBets = $updateGameBets;
        $this->updateStandings = $updateStandings;
        $this->updateLeaderboards = $updateLeaderboards;
    }

    public function handle(Competition $competition, ?Collection $crawlerGames = null): void
    {
        $crawlerGames ??= $competition->getCrawler()->fetchGames();
        $existingGames = $competition->games;

        $this->saveNewGames($competition, $crawlerGames, $existingGames);

        $existingGamesWithNoScore = $existingGames->where("is_done", false)
            ->keyBy("external_id");

        $gamesWithScore = $crawlerGames->filter(function($crawlerGame) use ($existingGamesWithNoScore){
            return $crawlerGame['is_done'] && $existingGamesWithNoScore->has($crawlerGame['external_id']);
        });

        $updatedGames = $this->updateGames($competition, $gamesWithScore, $existingGamesWithNoScore);

        if ($gamesWithScore->isNotEmpty()) {
            $teams = new EloquentCollection();
            $updatedGames->load(["teamHome", "teamAway"])
                         ->each(fn(Game $g) => $teams->add($g->teamHome)->add($g->teamAway));
            $this->updateScorers->handle($competition, $teams);

            if ($competition->hasAllGroupsStandings()) {
                $this->updateStandings->handle($competition);
            }

            if ($competition->isGroupStageDone()) {
                $this->calculateSpecialBets->execute($competition->id, SpecialBet::TYPE_OFFENSIVE_TEAM, $competition->getOffensiveTeams()->join(","));
            }
        }
    }

    /**
     * @param Competition        $competition
     * @param Collection         $games
     * @param EloquentCollection $existingGames
     *
     * @return void
     */
    protected function saveNewGames(
        Competition $competition,
        Collection $games,
        EloquentCollection $existingGames
    ): void {
        $newGames = $games->filter(fn ($game) => !$existingGames->contains('external_id', $game['external_id']));

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
     * @param Competition        $competition
     * @param Collection $gamesWithScore
     * @param EloquentCollection             $gamesWithNoScore
     *
     * @return EloquentCollection
     */
    protected function updateGames(
        Competition $competition,
        Collection $gamesWithScore,
        EloquentCollection $gamesWithNoScore
    ): EloquentCollection {
        $teamsByExternalId = $competition->teams->pluck("id", "external_id");
        $games = new EloquentCollection();
        foreach ($gamesWithScore as $gameData) {
            /** @var Game $game */
            $game = $gamesWithNoScore->get($gameData['external_id']);
            $game->result_home = $gameData['result_home'];
            $game->result_away = $gameData['result_away'];
            $game->ko_winner   = $teamsByExternalId[$gameData['ko_winner_external_id']];
            $game->save();

            $games->add($game);

            Log::debug("Saving Result of Game: ext_id - " . $game->external_id . " | id - " . $game->id . "-> " . $game->result_home . " - " . $game->result_away);
            $this->updateGameBets->handle($game);
            $this->updateLeaderboards->handle($game->competition);
            if ($game->isKnockout()) {
                $winner = null;
                $runnerUp = null;
                if ($game->sub_type = 'FINAL') {
                    $winner = $game->ko_winner;
                    $runnerUp = $game->ko_winner == $game->team_home_id ? $game->team_away_id : $game->team_home_id;
                }

                $this->calculateSpecialBets->execute($game->competition_id, SpecialBet::TYPE_WINNER, $winner);
                $this->calculateSpecialBets->execute($game->competition_id, SpecialBet::TYPE_RUNNER_UP, $runnerUp);
            }
        }

        return $games;
    }
}