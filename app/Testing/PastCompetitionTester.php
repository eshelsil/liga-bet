<?php

namespace App\Testing;

use App\Actions\UpdateCompetition;
use App\Competition;
use App\Enums\BetTypes;
use App\Game;
use App\Group;
use App\Player;
use App\Team;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Tinker helper that spins up a *test* competition cloned from a past one and
 * lets you "replay" it game-by-game, so the real update pipeline (bet scoring,
 * scorers, standings, leaderboards) runs against mocked results — without ever
 * hitting the live crawler / network.
 *
 * The clone is completely independent: it creates its OWN teams / groups /
 * players / games rows and never stores the source competition's ids. The link
 * back to the source (used to pull results) is by NAME.
 *
 * The test competition carries this config, which the Crawler reads to produce
 * the mock results (so a normal `liga-bet:update-running-competitions` run also
 * works on it — it is just another "ongoing" competition):
 *
 *   'test-competition'             => true
 *   'mock-update-from-competition' => <source competition id>
 *   'current_game'                 => <index into the sorted source games>
 *
 * Usage (php artisan tinker):
 *
 *   use App\Testing\PastCompetitionTester;
 *
 *   // 1. clone a real/finished competition (id 3) into a fresh test competition
 *   $t = PastCompetitionTester::create(3, 'WC22 replay');
 *   $t->competition()->id;          // -> the new competition id
 *
 *   // ...build the tournament(s) / users / bets you want to test on it...
 *
 *   // 2. see the schedule and the index of each game
 *   $t->listGames();
 *
 *   // 3. jump to "game #10 is live right now": shifts kick-off times so game 10
 *   //    starts ~now, marks games 0..9 done (with their original results &
 *   //    scorers), game 10 live, the rest reset to null, then runs the update.
 *   $t->setCurrentGame(10);
 *
 *   // ...check the UI / leaderboards, then advance:
 *   $t->setCurrentGame(11);
 *
 *   // Re-attach in a later tinker session:
 *   $t = PastCompetitionTester::load($testCompetitionId);
 */
class PastCompetitionTester
{
    public const CONFIG_IS_TEST      = 'test-competition';
    public const CONFIG_SOURCE       = 'mock-update-from-competition';
    public const CONFIG_CURRENT_GAME = 'current_game';

    public function __construct(
        protected Competition $competition,
        protected Competition $source,
    ) {
    }

    /* ------------------------------------------------------------------ */
    /* Entry points                                                       */
    /* ------------------------------------------------------------------ */

    /**
     * Clone a past competition into a fresh, independent test competition.
     *
     * Status is "initial", every cloned game is is_done=0 with null results and
     * no scorers. Only group-stage games are created up-front; knockout games
     * are created later (by setCurrentGame) once both their teams are known.
     */
    public static function create(int $sourceCompetitionId, ?string $name = null): self
    {
        $source = Competition::with(['groups', 'teams.players', 'games'])->findOrFail($sourceCompetitionId);

        $test = DB::transaction(function () use ($source, $name) {
            $test = new Competition();
            $test->type   = $source->type;
            $test->name   = $name ?: ('[TEST] ' . ($source->name ?: "competition {$source->id}"));
            $test->status = Competition::STATUS_INITIAL;
            $test->emblem = $source->emblem;
            $test->config = array_merge((array) $source->config, [
                self::CONFIG_IS_TEST      => true,
                self::CONFIG_SOURCE       => $source->id,
                self::CONFIG_CURRENT_GAME => null,
            ]);
            $test->save();

            // Groups (source group id -> new group id, used only while cloning).
            $newGroupIdBySourceId = [];
            foreach ($source->groups as $sg) {
                $g = new Group();
                $g->competition_id = $test->id;
                $g->external_id    = $sg->external_id;
                $g->name           = $sg->name;
                $g->save();
                $newGroupIdBySourceId[$sg->id] = $g->id;
            }

            // Teams (+ players). source team id -> new team id, used only while cloning.
            $newTeamIdBySourceId = [];
            foreach ($source->teams as $st) {
                $t = new Team();
                $t->competition_id = $test->id;
                $t->external_id    = $st->external_id;
                $t->name           = $st->name;
                $t->crest_url      = $st->crest_url;
                $t->group_id       = $newGroupIdBySourceId[$st->group_id] ?? null;
                $t->save();
                $newTeamIdBySourceId[$st->id] = $t->id;

                foreach ($st->players as $sp) {
                    $p = new Player();
                    $p->external_id = $sp->external_id;
                    $p->name        = $sp->name;
                    $p->team_id     = $t->id;
                    $p->shirt       = $sp->shirt;
                    $p->position    = $sp->position;
                    $p->goals       = 0;
                    $p->assists     = 0;
                    $p->save();
                }
            }

            // Group-stage games only (knockout games are created lazily).
            foreach ($source->games->where('type', Game::TYPE_GROUP_STAGE) as $sgame) {
                $g = new Game();
                $g->competition_id = $test->id;
                $g->external_id    = $sgame->external_id;
                $g->type           = $sgame->type;
                $g->sub_type       = $sgame->sub_type;
                $g->team_home_id   = $newTeamIdBySourceId[$sgame->team_home_id] ?? null;
                $g->team_away_id   = $newTeamIdBySourceId[$sgame->team_away_id] ?? null;
                $g->start_time     = $sgame->start_time;
                $g->ko_leg         = $sgame->ko_leg;
                $g->is_done        = false;
                $g->save();
            }

            return $test;
        });

        Log::info("[PastCompetitionTester] created test competition {$test->id} from source {$source->id}");

        return new self($test->load(['groups', 'teams.players', 'games', 'players']), $source);
    }

    /**
     * Re-attach to an existing test competition (e.g. in a new tinker session).
     */
    public static function load(int $testCompetitionId): self
    {
        $test = Competition::with(['groups', 'teams.players', 'games', 'players'])->findOrFail($testCompetitionId);

        $sourceId = data_get($test->config, self::CONFIG_SOURCE);
        if (! $sourceId) {
            throw new \RuntimeException("Competition {$testCompetitionId} is not a test competition (missing " . self::CONFIG_SOURCE . " config)");
        }

        $source = Competition::with(['groups', 'teams.players', 'games'])->findOrFail($sourceId);

        return new self($test, $source);
    }

    /* ------------------------------------------------------------------ */
    /* Core operation                                                     */
    /* ------------------------------------------------------------------ */

    /**
     * "Play" the competition up to the given game index.
     *
     * @param int  $index     index into the sorted source games. Games before it
     *                         become done (with their original results & scorers),
     *                         the game at it becomes live, later games are null.
     *                         Pass the game count to mark the WHOLE competition done.
     * @param bool $runUpdate  run UpdateCompetition right away to materialise the
     *                         state through the real pipeline (default true).
     */
    public function setCurrentGame(int $index, bool $runUpdate = true): void
    {
        $sorted = $this->sortedSourceGames();
        $count  = $sorted->count();
        if ($index < 0 || $index > $count) {
            throw new \InvalidArgumentException("current_game index {$index} out of range (0..{$count})");
        }

        $this->competition->refresh()->load(['groups', 'teams.players', 'games', 'players']);

        DB::transaction(function () use ($index, $sorted) {
            $this->ensureKnockoutGames($index, $sorted);
            $this->competition->load('games');
            $this->resetGameState();
            $this->shiftStartTimes($index, $sorted);

            $config = (array) $this->competition->config;
            $config[self::CONFIG_CURRENT_GAME] = $index;
            $this->competition->config = $config;
            $this->competition->status = Competition::STATUS_ONGOING;
            $this->competition->save();
        });

        Log::info("[PastCompetitionTester] set current_game={$index} on competition {$this->competition->id}");

        if ($runUpdate) {
            $this->competition->refresh()->load(['teams.players', 'games', 'players']);
            app(UpdateCompetition::class)->handle($this->competition);
        }
    }

    /**
     * Permanently delete this test competition and EVERYTHING attached to it:
     * tournaments, utls (user_tournament_links), bets, special bets,
     * leaderboards (+ versions), side tournaments, nihuses, nihus grants,
     * tournament preferences — plus the competition's own groups, teams,
     * players, games and goals data.
     */
    public function delete(): void
    {
        self::remove($this->competition->id);
    }

    /**
     * Delete a test competition (and all related entities) by id.
     *
     * Guarded: refuses to run unless the competition is a test competition
     * (config 'test-competition' => true), to avoid nuking a real one.
     */
    public static function remove(int $testCompetitionId): void
    {
        $competition = Competition::findOrFail($testCompetitionId);

        if (! data_get($competition->config, self::CONFIG_IS_TEST)) {
            throw new \RuntimeException(
                "Refusing to delete competition {$testCompetitionId}: it is not a test competition "
                . "(config '" . self::CONFIG_IS_TEST . "' is not true)."
            );
        }

        DB::transaction(function () use ($competition) {
            $tournamentIds = DB::table('tournaments')->where('competition_id', $competition->id)->pluck('id');
            $utlIds        = DB::table('user_tournament_links')->whereIn('tournament_id', $tournamentIds)->pluck('id');
            $gameIds       = DB::table('matches')->where('competition_id', $competition->id)->pluck('id');
            $teamIds       = DB::table('teams')->where('competition_id', $competition->id)->pluck('id');

            // Tournament-scoped children.
            DB::table('nihuses')->whereIn('tournament_id', $tournamentIds)->delete();
            DB::table('nihus_grants')->whereIn('user_tournament_id', $utlIds)->delete();
            DB::table('leaderboards')->whereIn('tournament_id', $tournamentIds)->delete();
            DB::table('leaderboards_versions')->whereIn('tournament_id', $tournamentIds)->delete();
            DB::table('bets')->whereIn('tournament_id', $tournamentIds)->delete();
            DB::table('bets')->whereIn('user_tournament_id', $utlIds)->delete(); // belt-and-braces
            DB::table('special_bets')->whereIn('tournament_id', $tournamentIds)->delete();
            DB::table('side_tournaments')->whereIn('tournament_id', $tournamentIds)->delete();
            DB::table('tournament_preferences')->whereIn('tournament_id', $tournamentIds)->delete();
            DB::table('user_tournament_links')->whereIn('tournament_id', $tournamentIds)->delete();
            DB::table('tournaments')->where('competition_id', $competition->id)->delete();

            // Competition-scoped data.
            DB::table('game_data_goals')->whereIn('game_id', $gameIds)->delete();
            DB::table('matches')->where('competition_id', $competition->id)->delete();
            DB::table('players')->whereIn('team_id', $teamIds)->delete();
            DB::table('teams')->where('competition_id', $competition->id)->delete();
            DB::table('groups')->where('competition_id', $competition->id)->delete();

            DB::table('competitions')->where('id', $competition->id)->delete();
        });

        Log::info("[PastCompetitionTester] deleted test competition {$testCompetitionId} and all related entities");
    }

    /* ------------------------------------------------------------------ */
    /* Inspection helpers                                                 */
    /* ------------------------------------------------------------------ */

    public function competition(): Competition
    {
        return $this->competition;
    }

    public function source(): Competition
    {
        return $this->source;
    }

    public function currentGame(): ?int
    {
        $value = data_get($this->competition->config, self::CONFIG_CURRENT_GAME);
        return $value === null ? null : (int) $value;
    }

    /**
     * Print the source schedule with the index to pass to setCurrentGame().
     */
    public function listGames(): void
    {
        $sorted   = $this->sortedSourceGames();
        $names    = $this->source->teams->pluck('name', 'id');
        $current  = $this->currentGame();

        foreach ($sorted as $i => $game) {
            $marker = $current === $i ? '>>' : '  ';
            echo sprintf(
                "%s [%2d] %-15s %s vs %s\n",
                $marker,
                $i,
                $game->sub_type . ($game->ko_leg ? " ({$game->ko_leg})" : ''),
                $names[$game->team_home_id] ?? '?',
                $names[$game->team_away_id] ?? '?'
            );
        }
        echo "   [{$sorted->count()}] (whole competition done)\n";
    }

    /* ------------------------------------------------------------------ */
    /* Internals                                                          */
    /* ------------------------------------------------------------------ */

    /** Source games sorted as the schedule order (start_time, then id). */
    protected function sortedSourceGames(): Collection
    {
        return $this->source->games
            ->sort(fn (Game $a, Game $b) => [$a->start_time, $a->id] <=> [$b->start_time, $b->id])
            ->values();
    }

    /**
     * Make sure exactly the knockout games whose teams are known under the given
     * current-game index exist in the test competition: create the missing ones
     * (teams mapped from the source by NAME), delete ones that are no longer known
     * (e.g. when stepping the index back).
     */
    protected function ensureKnockoutGames(int $current, Collection $sorted): void
    {
        $indexByGameId     = $sorted->mapWithKeys(fn (Game $g, int $i) => [$g->id => $i])->all();
        $sourceNameById    = $this->source->teams->pluck('name', 'id');
        $testTeamByName    = $this->competition->teams->keyBy('name');
        $testTeamNameById  = $this->competition->teams->pluck('name', 'id');
        $existingByKey     = $this->competition->games->keyBy(fn (Game $g) => $this->gameKey($g, $testTeamNameById));

        foreach ($sorted as $sourceGame) {
            if ($sourceGame->type !== Game::TYPE_KNOCKOUT) {
                continue; // group games are created at clone time
            }

            $key    = $this->gameKey($sourceGame, $sourceNameById);
            $known  = $this->sourceTeamsKnown($sourceGame, $current, $sorted, $indexByGameId);
            $exists = $existingByKey->has($key);

            if ($known && ! $exists) {
                $home = $testTeamByName->get($sourceNameById[$sourceGame->team_home_id] ?? null);
                $away = $testTeamByName->get($sourceNameById[$sourceGame->team_away_id] ?? null);
                if (! $home || ! $away) {
                    Log::warning("[PastCompetitionTester] cannot map teams for source game {$sourceGame->id}; skipping");
                    continue;
                }

                $g = new Game();
                $g->competition_id = $this->competition->id;
                $g->external_id    = $sourceGame->external_id;
                $g->type           = $sourceGame->type;
                $g->sub_type       = $sourceGame->sub_type;
                $g->team_home_id   = $home->id;
                $g->team_away_id   = $away->id;
                $g->start_time     = $sourceGame->start_time;
                $g->ko_leg         = $sourceGame->ko_leg;
                $g->is_done        = false;
                $g->save();
            } elseif (! $known && $exists) {
                // Stepping back: this knockout game's teams are no longer known.
                $stale = $existingByKey->get($key);
                DB::table('game_data_goals')->where('game_id', $stale->id)->delete();
                DB::table('bets')->where('type', BetTypes::Game)->where('type_id', $stale->id)->delete();
                $stale->delete();
            }
        }
    }

    /**
     * A source knockout game's teams are "known" once every earlier game that
     * involves either of its teams is done — i.e. their index is < current.
     */
    protected function sourceTeamsKnown(Game $game, int $current, Collection $sorted, array $indexByGameId): bool
    {
        $ownIndex   = $indexByGameId[$game->id];
        $teams      = [$game->team_home_id, $game->team_away_id];
        $maxFeeder  = -1;

        foreach ($sorted as $other) {
            $otherIndex = $indexByGameId[$other->id];
            if ($otherIndex >= $ownIndex) {
                continue;
            }
            if (in_array($other->team_home_id, $teams, true) || in_array($other->team_away_id, $teams, true)) {
                $maxFeeder = max($maxFeeder, $otherIndex);
            }
        }

        return $maxFeeder < $current;
    }

    /**
     * Reset every test game back to "not played", drop scorers/leaderboards and
     * null bet scores so the upcoming update recomputes everything cleanly.
     */
    protected function resetGameState(): void
    {
        $gameIds       = $this->competition->games->pluck('id');
        $teamIds       = $this->competition->teams->pluck('id');
        $tournamentIds = DB::table('tournaments')->where('competition_id', $this->competition->id)->pluck('id');

        DB::table('matches')->where('competition_id', $this->competition->id)->update([
            'is_done'             => false,
            'result_home'         => null,
            'result_away'         => null,
            'full_result_home'    => null,
            'full_result_away'    => null,
            'ko_winner'           => null,
            'done_time'           => null,
            'auto_bets_filled_at' => null,
        ]);

        DB::table('game_data_goals')->whereIn('game_id', $gameIds)->delete();
        DB::table('players')->whereIn('team_id', $teamIds)->update(['goals' => 0, 'assists' => 0]);

        $versionIds = DB::table('leaderboards_versions')->whereIn('tournament_id', $tournamentIds)->pluck('id');
        DB::table('leaderboards')->whereIn('version_id', $versionIds)->delete();
        DB::table('leaderboards_versions')->whereIn('id', $versionIds)->delete();

        // Drop game-bets that point at games which no longer exist (removed knockouts),
        // then null the score of every remaining bet so they are recomputed.
        DB::table('bets')
            ->whereIn('tournament_id', $tournamentIds)
            ->where('type', BetTypes::Game)
            ->whereNotIn('type_id', $gameIds)
            ->delete();
        DB::table('bets')->whereIn('tournament_id', $tournamentIds)->update(['score' => null]);
    }

    /**
     * Shift every test game's kick-off so that the game at $current starts ~now
     * (just kicked off). Relative spacing is preserved from the SOURCE start
     * times, so it is idempotent across calls.
     */
    protected function shiftStartTimes(int $current, Collection $sorted): void
    {
        $count = $sorted->count();
        if ($count === 0) {
            return;
        }

        if ($current < $count) {
            $reference = $sorted[$current]->start_time;
            $target    = time() - 60; // just kicked off
        } else {
            $reference = $sorted[$count - 1]->start_time; // whole competition done
            $target    = time() - 3 * 3600;
        }
        if ($reference === null) {
            return;
        }
        $delta = (int) $reference - $target;

        $testTeamNameById = $this->competition->teams->pluck('name', 'id');
        $sourceByKey      = $sorted->keyBy(fn (Game $g) => $this->gameKey($g, $this->source->teams->pluck('name', 'id')));

        foreach ($this->competition->games as $game) {
            $src = $sourceByKey->get($this->gameKey($game, $testTeamNameById));
            if (! $src || $src->start_time === null) {
                continue;
            }
            DB::table('matches')->where('id', $game->id)->update([
                'start_time' => (int) $src->start_time - $delta,
            ]);
        }
    }

    /**
     * Stable, name-based key for matching a game between competitions:
     * the (order-independent) pair of team names + stage/group + leg.
     */
    protected function gameKey(Game $game, Collection $teamNameById): string
    {
        $home = $teamNameById[$game->team_home_id] ?? '?';
        $away = $teamNameById[$game->team_away_id] ?? '?';
        $pair = collect([$home, $away])->sort()->values()->implode('::');

        return $pair . '|' . $game->sub_type . '|' . ($game->ko_leg ?? '');
    }
}
