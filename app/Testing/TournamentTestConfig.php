<?php

namespace App\Testing;

use App\Actions\UpdateCompetition;
use App\Competition;
use App\DataCrawler\Game as CrawlerGame;
use App\Enums\BetTypes;
use App\Game;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Local manual-testing helper for mocking competition results.
 *
 * Instead of editing Crawler::fetchGames() by hand, you describe the games you
 * want to mock as ongoing/done and run the update. UpdateCompetition builds the
 * games straight from this config (no crawler / network call) so bet scores,
 * scorers and leaderboards are calculated against your real, persisted test
 * tournament. reset() reverts everything from the snapshot taken on construction
 * — also without touching the crawler.
 *
 * Config is keyed by GAME id; goal scorer/assister are PLAYER ids:
 *
 *   $competition = Competition::find($testCompetitionId);
 *   $cfg = new TournamentTestConfig($competition, [
 *       101 => [                                        // game id
 *           'is_done'    => true,                       // false => "ongoing"
 *           'score_home' => 2,
 *           'score_away' => 1,
 *           'goals'      => [
 *               ['scorer' => 543, 'assister' => 88],    // player ids
 *               ['scorer' => 543],                       // assister optional
 *           ],
 *       ],
 *       102 => ['is_done' => false, 'score_home' => 1, 'score_away' => 0],
 *   ]);
 *
 *   $cfg->run();     // shift start times + run UpdateCompetition with the mocked data
 *   // ...check the UI...
 *   $cfg->reset();   // remove the test, restore the original data
 *
 *   // To then update from the real API, just run a normal update (no config):
 *   app(UpdateCompetition::class)->handle($competition);
 *
 * Or keep the config in a gitignored file under storage/app/testing/configs/ and
 * load it (see fromFile()):
 *
 *   $cfg = TournamentTestConfig::fromFile('my-test');
 *
 * NOTE: construct the config BEFORE running, while the DB still holds the original
 * data — that is the state reset() restores. Use it within a single tinker session.
 * Run tinker with extra memory if your test touches many games:
 *     php -d memory_limit=1G artisan tinker
 */
class TournamentTestConfig
{
    /** Original game rows captured at construction, keyed by game id. */
    protected array $originalGames = [];

    /** Original game_data_goals rows for the configured games, captured at construction. */
    protected array $originalGoals = [];

    /**
     * @param array $gamesConfig keyed by game id
     */
    public function __construct(
        protected Competition $competition,
        protected array $gamesConfig,
    ) {
        $this->captureOriginalState();
    }

    /**
     * Load a config from a (gitignored) file under storage/app/testing/configs/.
     * The file must `return` either a games-config array (keyed by game id) or
     * ['competition_id' => <id>, 'games' => [...]]. A passed $competition wins over
     * the file's competition_id.
     *
     * Accepts a bare name ("my-test"), a name with extension, or an absolute path.
     */
    public static function fromFile(string $name, ?Competition $competition = null): self
    {
        $path = $name;
        if (! is_file($path)) {
            $path = storage_path('app/testing/configs/' . $name);
        }
        if (! is_file($path) && is_file($path . '.php')) {
            $path .= '.php';
        }
        if (! is_file($path)) {
            throw new \RuntimeException("Test config '{$name}' not found (looked in storage/app/testing/configs/)");
        }

        $data = require $path;
        if (! is_array($data)) {
            throw new \RuntimeException("Test config '{$path}' must return an array");
        }

        $games = $data['games'] ?? $data;
        $competition = $competition
            ?? ($data['competition_id'] ?? null ? Competition::findOrFail($data['competition_id']) : null);

        if (! $competition) {
            throw new \RuntimeException("Test config '{$path}' has no competition_id; pass a Competition explicitly");
        }

        return new self($competition, $games);
    }

    /**
     * Run UpdateCompetition with this config attached (shift + mock + recalc).
     */
    public function run(): void
    {
        app(UpdateCompetition::class)->setTestConfig($this)->handle($this->competition);
    }

    /**
     * Build DataCrawler\Game objects for the configured games from their DB rows
     * plus the mocked result/done state. These are fed to UpdateCompetition as its
     * "crawler games", so no real apiCall happens.
     *
     * @return Collection<CrawlerGame> keyed by externalId
     */
    public function buildCrawlerGames(): Collection
    {
        $gamesById = $this->competition->games->keyBy('id');
        $teamExtIdById = $this->competition->teams->pluck('external_id', 'id');
        $crawlerGames = collect();

        foreach ($this->gamesConfig as $gameId => $cfg) {
            /** @var ?Game $game */
            $game = $gamesById->get($gameId);
            if (! $game) {
                \Log::warning("[TournamentTestConfig] no game found for id {$gameId}; skipping");
                continue;
            }

            $isDone = (bool) ($cfg['is_done'] ?? false);
            $resultHome = $cfg['score_home'] ?? null;
            $resultAway = $cfg['score_away'] ?? null;
            $teamHomeExtId = $teamExtIdById[$game->team_home_id] ?? null;
            $teamAwayExtId = $teamExtIdById[$game->team_away_id] ?? null;

            $koWinnerExternalId = null;
            if ($game->isKnockout() && $isDone && $resultHome !== null && $resultAway !== null) {
                if ($resultHome > $resultAway) {
                    $koWinnerExternalId = $teamHomeExtId;
                } elseif ($resultAway > $resultHome) {
                    $koWinnerExternalId = $teamAwayExtId;
                } else {
                    // level knockout: honour an explicit winner (team id), else default to home
                    $koWinnerExternalId = isset($cfg['winner_team_id'])
                        ? ($teamExtIdById[$cfg['winner_team_id']] ?? null)
                        : $teamHomeExtId;
                }
            }

            $crawlerGames->put((string) $game->external_id, new CrawlerGame(
                $game->external_id,
                $game->type,
                $game->sub_type,
                $teamHomeExtId,
                $teamAwayExtId,
                $game->start_time,
                $resultHome,
                $resultAway,
                $resultHome, // fullResult* = result (regular time)
                $resultAway,
                $resultHome, // totalResult* = result (no extra-time/penalties mocking)
                $resultAway,
                $koWinnerExternalId,
                $game->ko_leg,
                $isDone,
                true, // isStarted
            ));
        }

        return $crawlerGames;
    }

    /**
     * The mocked scorers, in the shape UpdateCompetitionScorers::fake() expects:
     * a collection keyed by DB game id, each a collection keyed by player
     * external_id => ['goals' => n, 'assists' => m].
     */
    public function getScorersByDbGameId(): Collection
    {
        $gamesById = $this->competition->games->keyBy('id');
        $playerExtIdById = $this->competition->players->pluck('external_id', 'id');
        $result = collect();

        foreach ($this->gamesConfig as $gameId => $cfg) {
            $game = $gamesById->get($gameId);
            if (! $game) {
                continue;
            }

            $perPlayer = collect();
            foreach (($cfg['goals'] ?? []) as $goal) {
                $this->addGoal($perPlayer, $playerExtIdById, $goal['scorer'] ?? null, 'goals');
                $this->addGoal($perPlayer, $playerExtIdById, $goal['assister'] ?? null, 'assists');
            }

            $result->put($game->id, $perPlayer);
        }

        return $result;
    }

    /**
     * Move the latest configured game (and every game before it) back in time so
     * the latest one lands just before now and counts as started. The shift is a
     * whole number of days (rounded up); later games stay put. Idempotent — it is
     * always computed from the original (pre-shift) start times.
     */
    public function applyStartTimeShift(): void
    {
        $latestStart = collect(array_keys($this->gamesConfig))
            ->map(fn ($gameId) => $this->originalStart($gameId))
            ->filter()
            ->max();

        if (! $latestStart) {
            return;
        }

        $diffSeconds = $latestStart - time();
        $shiftSeconds = $diffSeconds <= 0 ? 0 : (int) ceil($diffSeconds / 86400) * 86400;

        foreach ($this->originalGames as $gameId => $orig) {
            if ($orig['start_time'] !== null && (int) $orig['start_time'] <= $latestStart) {
                DB::table('matches')->where('id', $gameId)->update([
                    'start_time' => (int) $orig['start_time'] - $shiftSeconds,
                ]);
            }
        }

        \Log::info("[TournamentTestConfig] shifted games back by " . ($shiftSeconds / 86400) . ' days (latest configured game starts ~now)');
    }

    /**
     * Remove the test: restore the original game rows + scorer rows captured on
     * construction, and drop the leaderboard rows/versions and bet scores tied to
     * the configured games. Does NOT touch the crawler.
     */
    public function reset(): void
    {
        $configGameIds = $this->configGameIds();
        $tournamentIds = DB::table('tournaments')->where('competition_id', $this->competition->id)->pluck('id');

        DB::transaction(function () use ($configGameIds, $tournamentIds) {
            // 1. Restore the original game rows (start_time, is_done, score, ...).
            foreach ($this->originalGames as $gameId => $orig) {
                DB::table('matches')->where('id', $gameId)->update($orig);
            }

            // 2. Delete leaderboard versions (and their rows) linked to the config games.
            $versionIds = DB::table('leaderboards_versions')
                ->whereIn('tournament_id', $tournamentIds)
                ->whereIn('game_id', $configGameIds)
                ->pluck('id');
            DB::table('leaderboards')->whereIn('version_id', $versionIds)->delete();
            DB::table('leaderboards_versions')->whereIn('id', $versionIds)->delete();

            // 3. Null the score of game-bets for the config games (counterpart of #2).
            DB::table('bets')
                ->whereIn('tournament_id', $tournamentIds)
                ->where('type', BetTypes::Game)
                ->whereIn('type_id', $configGameIds)
                ->update(['score' => null]);

            // 4. Restore the original scorer rows and recompute the affected players' totals.
            $affectedPlayerIds = collect($this->originalGoals)->pluck('player_id')
                ->merge($this->configuredPlayerIds())
                ->unique();
            DB::table('game_data_goals')->whereIn('game_id', $configGameIds)->delete();
            foreach ($this->originalGoals as $row) {
                DB::table('game_data_goals')->insert($row);
            }
            foreach ($affectedPlayerIds as $playerId) {
                $totals = DB::table('game_data_goals')
                    ->where('player_id', $playerId)
                    ->selectRaw('COALESCE(SUM(goals),0) as g, COALESCE(SUM(assists),0) as a')
                    ->first();
                DB::table('players')->where('id', $playerId)->update(['goals' => $totals->g, 'assists' => $totals->a]);
            }
        });

        \Log::info("[TournamentTestConfig] reset {$configGameIds->count()} mocked games for competition {$this->competition->id}");
    }

    /* ------------------------------------------------------------------ */
    /* Helpers                                                            */
    /* ------------------------------------------------------------------ */

    private function addGoal(Collection $perPlayer, Collection $playerExtIdById, $playerId, string $stat): void
    {
        if ($playerId === null) {
            return;
        }
        $extId = $playerExtIdById[$playerId] ?? null;
        if ($extId === null) {
            \Log::warning("[TournamentTestConfig] no player found for id {$playerId}; skipping goal/assist");
            return;
        }
        $row = $perPlayer->get((string) $extId, ['goals' => 0, 'assists' => 0]);
        $row[$stat]++;
        $perPlayer->put((string) $extId, $row);
    }

    protected function captureOriginalState(): void
    {
        $columns = ['start_time', 'is_done', 'result_home', 'result_away', 'full_result_home', 'full_result_away', 'ko_winner', 'done_time'];

        $this->originalGames = DB::table('matches')
            ->where('competition_id', $this->competition->id)
            ->get(array_merge(['id'], $columns))
            ->keyBy('id')
            ->map(fn ($row) => collect((array) $row)->except('id')->all())
            ->all();

        $this->originalGoals = DB::table('game_data_goals')
            ->whereIn('game_id', $this->configGameIds())
            ->get(['game_id', 'player_id', 'goals', 'assists', 'created_at', 'updated_at'])
            ->map(fn ($row) => (array) $row)
            ->all();
    }

    protected function configGameIds(): Collection
    {
        $existingIds = $this->competition->games->pluck('id');
        return collect(array_keys($this->gamesConfig))
            ->filter(fn ($id) => $existingIds->contains($id))
            ->values();
    }

    protected function configuredPlayerIds(): Collection
    {
        return collect($this->gamesConfig)
            ->flatMap(fn ($cfg) => collect($cfg['goals'] ?? [])->flatMap(fn ($goal) => [$goal['scorer'] ?? null, $goal['assister'] ?? null]))
            ->filter()
            ->unique()
            ->values();
    }

    protected function originalStart($gameId): ?int
    {
        $start = $this->originalGames[$gameId]['start_time'] ?? null;
        return $start !== null ? (int) $start : null;
    }
}
