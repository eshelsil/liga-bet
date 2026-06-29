# Live game minute — plan

## Goal
Fetch the live minute of in-progress games from 365scores, store it on the `matches`
table, expose it as a string on `GameResource`. Null for not-started and ended games.
Handle stoppage time and extra time.

## 365 source field (verified against live 365 API, 2026-06-28)
Each 365 game object carries `gameTimeDisplay`:
- normal play: `"59'"`, `"77'"`, `"120'"`, `"102'"`
- stoppage / added time: `"45+2'"` style (base + added)
- non-minute states: `""` (scheduled/ended), `"HT"`, `"Pen."`, clock `"01:18"` (other sports)

`gameTime` is a float (e.g. `59.0`) but loses the stoppage `+N`, so `gameTimeDisplay`
is the authoritative source. No separate `addedTime` field is present in the feed.

## Target output format (GameResource `minute`, a string or null) — DECIDED
Pass 365 through verbatim (raw, no reformatting):
- `"87'"`, `"102'"` (plain minute, with 365's trailing apostrophe)
- `"45+2'"`, `"90+5'"`, `"120+2'"`, `"105+1'"` (stoppage / extra time, raw)
- break states pass through as the 365 label: `"HT"`, `"Pen."` (from `shortStatusText`)
- `null` only when: game not started, or game ended

## Parser (in Crawler) — `live365Minute($game365)`
1. `gameTimeDisplay` non-empty → return it verbatim (running clock incl. stoppage)
2. else `shortStatusText` non-empty → return it (break label: HT / Pen.)
3. else → null
Only called for live (started, not-done) games; done → null.

## Changes
1. **Migration** `matches.minute` — nullable string.
2. **`Game.php`** (model) — add `minute` to docblock (string|null).
3. **DataCrawler `Game` DTO** — add trailing `public ?string $minute = null` (16→17
   ctor args; all existing call sites pass 16 positional, so unaffected).
4. **Crawler** — add `parse365Minute()`; set `minute` in the two real fetch paths:
   - `overlayScoresFrom365()` (football-data + 365 overlay path)
   - `fetchGames365()` (native 365 path)
   Only for started & not-done games; done → null.
5. **`UpdateCompetition::updateGames()`** — `$game->minute = $gameData->minute;`
   (a game that just ended is processed once more this run with minute=null).
6. **`GameResource`** — add `"minute" => $game->minute`.

## Decisions (confirmed)
- Store/return 365's value **verbatim** (raw `gameTimeDisplay`, e.g. `"45+2'"`, `"87'"`).
- Non-numeric live states (Half Time, Penalties) → **pass through the label** (`"HT"`,
  `"Pen."` from `shortStatusText`), not null.
- Null only for not-started and ended games.
</content>
</invoke>
