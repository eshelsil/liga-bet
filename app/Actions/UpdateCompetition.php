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
use App\Game;
use App\Enums\GameSubTypes;
use App\SpecialBets\SpecialBet;
use App\Tournament;
use App\User;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class UpdateCompetition
{
    private CalculateSpecialBets $calculateSpecialBets;
    private UpdateCompetitionScorers $updateScorers;
    private UpdateCompetitionStandings $updateStandings;
    private UpdateGameBets $updateGameBets;
    private UpdateLeaderboards $updateLeaderboards;
    private Collection $crawlerGames;

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

    public function handle(Competition $competition): void
    {
        Cache::lock("updateCompetition:{$competition->id}", 120)
            ->block(0, function () use ($competition) {
                Log::debug("[UpdateCompetition][handle] Entered new request!");
                if (! $this->hasOpenGames($competition)) {
                    Log::debug("[UpdateCompetition][handle] No waiting games...");
                    return;
                }

                $this->crawlerGames = $this->fakeGames ?? $competition->getCrawler()->fetchGames();

                $this->saveNewGames($competition);

                $existingNonFinishedGames = $competition->games->where("is_done", false)
                    ->keyBy("external_id");

                $gamesWithScore = $this->crawlerGames->filter(function (CrawlerGame $crawlerGame) use ($existingNonFinishedGames) {
                    return $crawlerGame->isStarted && $existingNonFinishedGames->has($crawlerGame->externalId);
                });

                $updatedGames = $this->updateGames($competition, $gamesWithScore, $existingNonFinishedGames);
                $this->updateScorers->handle($competition);
                $gameIdsUpdatedScorers = $this->updateScorers->getRelevantGameIds();
                $doneGames = $updatedGames->filter(fn($g) => $g->is_done);

                if ($doneGames->count() > 0) {
                    $this->updateStandings->handle($competition);

                    // TODO: There was a bug here. i think we should refresh the games before check $competition->isGroupStageDone() -->  should verify `->load("games")` solves the issue
                    if ($doneGames->first(fn($g) => $g->isGroupStage()) && $competition->load("games")->isGroupStageDone()) {
                        $this->calculateSpecialBets->execute($competition->id, SpecialBet::TYPE_OFFENSIVE_TEAM, $competition->getOffensiveTeams()->join(","));
                    }

                }

                $gameIdsAffectingLeaderboard = $doneGames->pluck('id')->concat($gameIdsUpdatedScorers);
                if ($gameIdsAffectingLeaderboard->count() > 0) {
                    $firstAffectedGameId = $competition->getSortedGameIds()->first(
                        fn($id) => $gameIdsAffectingLeaderboard->contains($id)
                    );
                    $this->updateLeaderboards->handle($competition, $firstAffectedGameId);
                }
            });
    }

    /**
     * @param Competition        $competition
     *
     * @return void
     */
    protected function saveNewGames(Competition $competition): void
    {
            $crawlerNewGames = $this->crawlerGames->filter(fn (CrawlerGame $game) => !$competition->games->contains('external_id', $game->externalId));

        $autoBet = (new MonkeyAutoBetCompetitionGames());

        $teamsByExternalId = $competition->teams->pluck("id", "external_id");

        $grouped = $games->groupBy(function ($game) {
            return $game->key_a . '_' . $game->key_b;
        });

        $gamesWithLegs = $crawlerGames->filter(fn (CrawlerGame $game) => $this->isTwoLegedTie($game, $competition));
        $groupedByLegs = $crawlerGames->groupBy($this->gameToLegsId)->map(
            fn(Collection|CrawlerGame $games) => $games->sortBy('startTime')->map(fn($g)=>$g->externalId)
        );
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

            $legsId = $this->gameToLegsId($crawlerGame);
            if ($legs = $groupedByLegs->get($legsId)){
                if ($legs[0] == $crawlerGame->externalId){
                    $game->ko_leg = Game::LEG_TYPE_FIRST;
                } else if ($legs[1] == $crawlerGame->externalId){
                    $game->ko_leg = Game::LEG_TYPE_SECOND;
                }
            }
            Log::debug("Saving Game: " . $game->team_home_id . " vs. " . $game->team_away_id . "<br>");

            $game->save();
            User::getMonkeyUsers()->each(fn(User $monkey) => $autoBet->handle($monkey, $game));
        }
    }

    protected function isTwoLegedTie(CrawlerGame $game, Competition $competition): bool
    {
        if ($competition->getCompetitionType() != Competition::TYPE_UCL){
            if ($game->type == Game::TYPE_KNOCKOUT && $game->subType != GameSubTypes::FINAL){
                return true;
            }
        }
        return false;
    }

    protected function gameToLegsId(CrawlerGame $game): string
    {
        $playingTeams = collect([$game->teamAwayExternalId, $game->teamHomeExternalId])->sort()->values();
        return $game->type."_".$game->subType."_".$playingTeams[0].$playingTeams[1];  
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
            if ($gameData->isDone && !$game->is_done) {
                $game->done_time = time();
            }
            $game->is_done = $gameData->isDone;
            if ($gameData->isDone && $gameData->koWinnerExternalId) {
                $game->ko_winner   = $teamsByExternalId[$gameData->koWinnerExternalId];
            }
            $game->save();

            $games->add($game);

            Log::debug("Saving Result of Game: status - ".($game->is_done ? 'done' : 'live')."  ext_id - " . $game->external_id . " | id - " . $game->id . "-> " . $game->result_home . " - " . $game->result_away);
            if ($game->is_done){
                $this->updateGameBets->handle($game);
    
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

    function hasOpenGames(Competition $competition): bool
    {
        return $competition->games()
            ->where("start_time", ">=", now()->timestamp)
            ->orWhere("is_done", false)
            ->exists();
    }
}