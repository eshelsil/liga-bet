# Testing with a past competition

`App\Testing\PastCompetitionTester` lets you spin up a **test competition** cloned
from a real/finished one and "replay" it game-by-game, so the real update
pipeline (bet scoring, scorers, standings, leaderboards) runs against mocked
results — **without ever hitting the live crawler / network**.

It is meant to be driven from `php artisan tinker`.

---

## How it works

- **`create()`** clones a source competition into a brand-new, fully independent
  competition: its own `teams` / `groups` / `players` / `games` rows. It never
  reuses the source competition's `team_id` / `player_id` / `game_id`. The link
  back to the source (used to read results) is **by name**.
- The clone starts at `status = initial`, every game `is_done = 0`, all results
  `null`, no scorers. Only **group-stage** games are created up front. **Knockout
  games are created lazily** — only once both their teams are known (i.e. every
  earlier game that decides those teams is done).
- The test competition carries this config, which the `Crawler` reads to produce
  the mock results:

  ```
  test-competition             => true
  mock-update-from-competition => <source competition id>
  current_game                 => <index into the sorted source schedule>
  ```

  Because the mock lives in the crawler + config, the normal
  `liga-bet:update-running-competitions` cron also updates this competition — it
  is just another "ongoing" competition.

- **`setCurrentGame($index)`** is the main control. It:
  1. creates/removes knockout games so exactly the ones whose teams are known
     under `$index` exist,
  2. resets all game/scorer/leaderboard/bet state,
  3. **shifts every kick-off time** so the game at `$index` starts ~now (relative
     spacing preserved from the source — idempotent across calls),
  4. writes `current_game` to config and marks the competition `ongoing`,
  5. runs `UpdateCompetition` to materialise everything.

  Result:
  - games **before** `$index` → `is_done = 1`, original results + goals,
  - the game **at** `$index` → `is_done = 0` (live), original results + goals,
  - games **after** `$index` → `is_done = 0`, results + goals `null`.

---

## Usage

```php
use App\Testing\PastCompetitionTester;

// 1. Clone a real/finished competition (id 3) into a fresh test competition.
$t = PastCompetitionTester::create(3, 'WC22 replay');   // 2nd arg (name) optional
$t->competition()->id;        // -> the new competition's id

// 2. Build the tournament(s) / users / bets you want to test ON $t->competition().
//    (Bet scoring & leaderboards only do something if there are bets to score.)

// 3. See the schedule and the index to pass to setCurrentGame().
$t->listGames();

// 4. "Play" up to a game. e.g. make game #10 live right now:
$t->setCurrentGame(10);       // 0..9 done (w/ results+scorers), 10 live, rest null

// 5. Check the UI / leaderboards, then advance one (or several) at a time:
$t->setCurrentGame(11);

// Mark the WHOLE competition done — pass the game count:
$t->setCurrentGame( $t->source()->games->count() );
```

### Re-attaching in a later tinker session

`create()` returns a live object, but a new tinker session starts fresh. Re-attach
by the test competition's id:

```php
$t = PastCompetitionTester::load($testCompetitionId);
$t->setCurrentGame(12);
```

### Deleting a test competition

When you're done, delete the test competition and **everything** attached to it
(tournaments, utls, bets, special bets, leaderboards + versions, side tournaments,
nihuses, nihus grants, preferences, plus its own groups, teams, players, games and
goals data):

```php
$t->delete();                              // delete the one this object wraps

// or by id (e.g. from a fresh session):
PastCompetitionTester::remove($testCompetitionId);
```

This is **guarded**: it refuses (throws) unless the competition has
`config['test-competition'] === true`, so you can't accidentally nuke a real
competition. It runs in a single DB transaction.

### Useful accessors

```php
$t->competition();    // the test Competition model
$t->source();         // the source Competition model
$t->currentGame();    // current index (null until first setCurrentGame)
$t->listGames();      // prints "[idx] STAGE  Home vs Away", marks the current one
```

---

## Good to know

- **`current_game` is an index into the sorted source schedule** (`start_time`,
  then `id`). `listGames()` prints those indexes. Passing the game *count* marks
  the whole competition done (no live game).
- **`setCurrentGame()` is idempotent** and supports stepping **backward**. On each
  call it nulls bet scores and drops the competition's leaderboard versions so the
  update recomputes cleanly. Stepping back also deletes knockout games whose teams
  are no longer known (and their bets/goals).
- **Set up the tournament first.** Cloning copies teams/players/games but not your
  tournaments/users/bets — create those on `$t->competition()` before
  `setCurrentGame()` if you want to see bets scored and leaderboards move.
- **No network.** Everything is read from the source competition's stored
  `matches` and `game_data_goals`. Scorers are read from the source's
  `game_data_goals`, so they only appear where the source actually had them.
- **Run tinker with more memory** if the competition is large:
  `php -d memory_limit=1G artisan tinker`.
- This is separate from `App\Testing\TournamentTestConfig` (the manual,
  per-game-config helper). Both can coexist.

---

## What it touches in the codebase

- `app/Testing/PastCompetitionTester.php` — the utility (this is the only entry point).
- `app/DataCrawler/Crawler.php` — `fetchGamesFromConfig()` / `fetchScorersFromConfig()`
  produce the mock results from config.
- `app/Actions/UpdateCompetition.php` & `app/Actions/UpdateCompetitionScorers.php` —
  for a `test-competition`, read from the crawler's config methods instead of the API.
- The `Competition` model is **not** modified.
