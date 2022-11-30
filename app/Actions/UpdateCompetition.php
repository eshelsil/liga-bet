<?php
/**
 * Created by PhpStorm.
 * User: omer
 * Date: 10/07/2022
 * Time: 1:27
 */

namespace App\Actions;

use App\Competition;
use App\DataCrawler\Game as CrawlerGame;
use App\Enums\BetTypes;
use App\Game;
use App\Http\Resources\LeaderboardVersionResource;
use App\LeaderboardsVersion;
use App\SpecialBets\SpecialBet;
use App\Tournament;
use App\User;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class UpdateCompetition
{
    private CalculateSpecialBets $calculateSpecialBets;
    private UpdateCompetitionScorers $updateScorers;
    private UpdateCompetitionStandings $updateStandings;
    private UpdateGameBets $updateGameBets;
    private UpdateLeaderboards $updateLeaderboards;

    private ?Collection $fakeGames = null;

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

    public function fake(?Collection $games = null, ?Collection $scorers = null, ?Collection $standings = null)
    {
        $this->fakeGames = $games;
        $this->updateScorers->fake($scorers);
        $this->updateStandings->fake($standings);
    }

    public function handleLive(Competition $competition): Collection
    {
        $data = collect();

        try {
            \DB::transaction(function() use ($competition, $data) {
                $this->handle($competition, true);
                $competition->tournaments
                    ->filter(fn(Tournament $t) => !config("test.onlyTournamentId") || config("test.onlyTournamentId") == $t->id)
                    ->load([
                        "leaderboardVersionsLatest.leaderboards",
                        "bets" => function (HasMany $query) {
                            $query->whereNotNull('score');
                        }
                    ])
                    ->each(fn (Tournament $t) => $data[$t->id] = [
                        "leaderboard" => $t->leaderboardVersionsLatest,
                        "bets" => $t->bets->groupBy("user_tournament_id")
                    ]);
            });
        } catch (\Throwable $e) {}

        return $data;
    }

    public function handle(Competition $competition, $updateExternalIncompleted = false): void
    {
        $crawlerGames = $this->fakeGames ?? $competition->getCrawler()->fetchGames();
        $existingGames = $competition->games;

        $this->saveNewGames($competition, $crawlerGames, $existingGames);

        $existingNonFinishedGames = $existingGames->where("is_done", false)
            ->keyBy("external_id");


        $gamesWithScore = $crawlerGames->filter(function(CrawlerGame $crawlerGame) use ($existingNonFinishedGames, $updateExternalIncompleted) {
            if (!$existingNonFinishedGames->has($crawlerGame->externalId)) {
                return false;
            }
            return $crawlerGame->isStarted;
        });

        $updatedGames = $this->updateGames($competition, $gamesWithScore, $existingNonFinishedGames);
        $this->updateScorers->handle($competition);
        $doneGames = $updatedGames->filter(fn($g) => $g->is_done);

        if ($updatedGames->filter(fn($g) => $g->is_done)->count() > 0) {
            $this->updateStandings->handle($competition);

            if ($doneGames->filter(fn($g) => $g->isGroupStage())->count() > 0 && $competition->isGroupStageDone()) {
                $this->calculateSpecialBets->execute($competition->id, SpecialBet::TYPE_OFFENSIVE_TEAM, $competition->getOffensiveTeams()->join(","));
                $this->updateLeaderboards->handle($competition, null, "{\"question\":".SpecialBet::TYPE_OFFENSIVE_TEAM."\"}");
            }
        }
    }

    /**
     * @param Competition        $competition
     * @param Collection         $crawlerGames
     * @param EloquentCollection $existingGames
     *
     * @return void
     */
    protected function saveNewGames(
        Competition $competition,
        Collection $crawlerGames,
        EloquentCollection $existingGames
    ): void {
        $crawlerNewGames = $crawlerGames->filter(fn (
            CrawlerGame $game) => !$existingGames->contains('external_id', $game->externalId));

        $autoBet = (new MonkeyAutoBetCompetitionGames());

        $teamsByExternalId = $competition->teams->pluck("id", "external_id");

        /** @var CrawlerGame $crawlerGame */
        foreach ($crawlerNewGames as $crawlerGame) {
            $game                   = new Game();
            $game->competition_id   = $competition->id;
            $game->external_id      = $crawlerGame->externalId;
            $game->type             = $crawlerGame->type;
            $game->sub_type         = $crawlerGame->subType;
            $game->team_home_id     = $teamsByExternalId[$crawlerGame->teamHomeExternalId];
            $game->team_away_id     = $teamsByExternalId[$crawlerGame->teamAwayExternalId];
            $game->start_time       = $crawlerGame->startTime;

            Log::debug("Saving Game: " . $game->team_home_id . " vs. " . $game->team_away_id . "<br>");

            $game->save();
            User::getMonkeyUsers()->each(fn(User $monkey) => $autoBet->handle($monkey, $game));
        }
    }

    /**
     * @param Competition        $competition
     * @param Collection $gamesWithScore
     * @param EloquentCollection             $nonFinishedGames
     *
     * @return EloquentCollection
     */
    protected function updateGames(
        Competition $competition,
        Collection $gamesWithScore,
        EloquentCollection $nonFinishedGames
    ): EloquentCollection {
        $teamsByExternalId = $competition->teams->pluck("id", "external_id");
        $games = new EloquentCollection();
        /** @var CrawlerGame $gameData */
        foreach ($gamesWithScore as $gameData) {
            /** @var Game $game */
            $game = $nonFinishedGames->get($gameData->externalId);
            $game->result_home = $gameData->resultHome;
            $game->result_away = $gameData->resultAway;
            $game->full_result_home = $gameData->fullResultHome;
            $game->full_result_away = $gameData->fullResultAway;
            $game->is_done = $gameData->isDone;
            if ($gameData->isDone && $gameData->koWinnerExternalId) {
                $game->ko_winner   = $teamsByExternalId[$gameData->koWinnerExternalId];
            }
            $game->save();

            $games->add($game);

            Log::debug("Saving Result of Game: status - ".($game->is_done ? 'done' : 'live')."  ext_id - " . $game->external_id . " | id - " . $game->id . "-> " . $game->result_home . " - " . $game->result_away);
            if ($game->is_done){
                $this->updateGameBets->handle($game);
                $this->updateLeaderboards->handle($game->competition, $game->id);
    
                if ($game->isKnockout()) {
                    $winner = null;
                    $runnerUp = null;
                    if ($game->sub_type == 'FINAL') {
                        $winner = $game->ko_winner;
                        $runnerUp = $game->ko_winner == $game->team_home_id ? $game->team_away_id : $game->team_home_id;
                    }
    
                    $this->calculateSpecialBets->execute($game->competition_id, SpecialBet::TYPE_WINNER, $winner);
                    $this->calculateSpecialBets->execute($game->competition_id, SpecialBet::TYPE_RUNNER_UP, $runnerUp);
                }
            }
        }

        return $games;
    }
}