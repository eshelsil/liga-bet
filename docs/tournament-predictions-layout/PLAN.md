# Knockout-bracket "Predictions" view — post-start layout

## Goal

The "Predictions" view (route `/open-matches`, served by `BracketProvider` for
knockout_bracket tournaments) currently shows the same thing always: your
runner-up/winner pick (podium/editor) + open game bets.

We want it to **branch on tournament start**:

- **Before start** — keep exactly today's view (`BracketWinnerFlow`: podium +
  editor + `BracketGamesList`). No change.
- **After start** — a new layout with 5 sections.

`IsTournamentStarted` selector (`tournament.status ∈ {Ongoing, Finished}`,
`frontend/src/_selectors/base/singleModel.ts`) already exists and already
drives `special.locked`. We branch on it.

## Locked design decisions

1. **Default tab = "My Bets" (open bets), always.** The "Games" tab shows a
   pulsing red dot when a live game exists and that tab isn't selected.
   (Not "default to ongoing if a live game exists".)
2. **Bracket modal = actual games only.** Render the real bracket slots as they
   fill in; ignore the user's winner/RU pick entirely — no champion/finalist
   overlay in the center.
3. **W/RU contestants table = its own button → its own modal**, separate from
   past results (past results live in the Games tab "Done" sub-tab).

## Target post-start layout

```
┌─────────────────────────────────────────────┐
│  [ 🗺 Bracket ]      [ 🏆 Winner table ]      │  ← 2 buttons, each opens a modal
├─────────────────────────────────────────────┤
│  ( My Bets ● )   ( Games ⦿pulse )            │  ← 2 tabs
├─────────────────────────────────────────────┤
│  My Bets (default):                          │
│    open/upcoming game bets (also if filled)  │  → reuse BracketGamesList
│                                              │
│  Games:                                      │
│    ( Ongoing | Done )  ← sub-tabs            │
│    ongoing default if a live game exists,    │
│    else Done                                 │
│    each game → gamblers list                 │  → reuse GameGumblersList
└─────────────────────────────────────────────┘
```

### Section → implementation mapping

| # | Section | Placement | Build / Reuse |
|---|---------|-----------|---------------|
| 1 | Bracket (actual slots, no pick) | Button → modal | **New** spectator render of `BracketTree`; reuse `bracketLayout` + `BracketSlotView` |
| 2 | Upcoming games (open bets, incl. filled) | Tab "My Bets" (default) | **Reuse** `BracketGamesList` as-is |
| 3 | Ongoing games + gamblers | Tab "Games" → "Ongoing" sub-tab (default if live) | **Reuse** `GameGumblersList` (+ live game data) |
| 4 | Contestants W/RU table | Button → modal | **New** `ContestantPicksTable` (data already exists) |
| 5 | Past game bets + gamblers | Tab "Games" → "Done" sub-tab | **Reuse** `GameGumblersList` |

## Components & data — what already exists

- **Open bets (sec 2):** `frontend/src/bracket/BracketGamesList.tsx` already
  renders open/upcoming knockout ties (filled or not). Drop in unchanged.
- **Gamblers list (sec 3 & 5):** `frontend/src/matches/GameGumblersList.tsx`
  (one game → everyone's bets + points). Fed today by `ClosedMatchBetsSelector`
  (`frontend/src/_selectors/closedMatchBets.ts`) which yields `live_matches` and
  `done_matches` with `betsByValue`. The classic `MatchesView` already wraps
  these in **Live / Done tabs** — strong reuse candidate for the whole "Games"
  tab.
- **W/RU table (sec 4):** all data already aggregated —
  - `ScoreboardSelector` (`_selectors/logic/scoreboard.ts`) → rows with
    `user_tournament_id` + `name`.
  - `WinnerBetByUtlId` / `RunnerUpBetByUtlId` (`_selectors/logic/winnerBet.ts`)
    → `Record<utlId, QuestionBetWithRelations>`; `.answer` is the picked team.
  - So the table is a pure render, no new selector required.
- **Notifications (sec 2 red dot):** `MissingGameBetsCount` /
  `MissingGameBetsIds` (`_selectors/logic/notifications.ts`, already
  knockout-filtered). Badge pattern from `open_matches/MatchBetView.tsx`.
- **Tabs / modal patterns:** `widgets/Tabs/*` and MUI `Dialog` (used across the
  bracket dialogs).

## Net-new work

1. **`BracketStartedView`** (new) — the post-start container: 2 buttons + 2 tabs
   + the two modals. Branch added in `BracketProvider` (or top of
   `BracketWinnerFlow`):
   `IsTournamentStarted ? <BracketStartedView/> : <BracketWinnerFlow/>`.

2. **Spectator bracket (sec 1)** — biggest new piece. Today `BracketTree`
   renders side blocks from `games` (actual teams as they qualify) **plus** a
   bottom "final area" that is the user's finalist/champion picker. For the
   modal we want blocks only, including the **Final game** as a normal slot
   (today the Final is excluded from `rounds` and replaced by the picker).
   - Approach: a `spectator` mode (prop) on `BracketTree`, or a thin
     `BracketSpectatorTree`, that renders `layout.blocks` + connectors for all
     rounds **including Final**, and omits finalist/winner picker frames.
   - Need to confirm `computeBracketLayout` can include the Final round as a
     block (currently caller passes `sideRounds` = Final excluded).

3. **Games tab (sec 3 & 5)** — preferred: reuse classic
   `ClosedMatchBetsProvider` + `MatchesView` (already Live/Done sub-tabs +
   `GameGumblersList`), scoped to knockout games. Need to verify
   `ClosedMatchBetsSelector` returns knockout games for a bracket tournament; if
   it returns all games, filter to `is_knockout` (same filter `MissingGameBetsIds`
   uses). If reuse is clean, sec 3+5 are nearly free.

4. **`ContestantPicksTable` (sec 4)** — table: name | runner-up | winner, from
   `ScoreboardSelector` + Winner/RunnerUp-by-utlId. Render team flag + name per
   cell (reuse `TeamFlag`).

5. **Pulse red dot** — small CSS: pulsing variant of the existing error `Badge`
   on the "Games" tab when `LiveGames` non-empty and tab not active.

## Open questions / risks

- **Q:** "Games" tab when no live game exists — keep the tab (Done only,
  Ongoing sub-tab hidden/empty) or hide ongoing sub-tab? Original note said the
  ongoing view "can be optionally not shown". Proposed: keep the Games tab
  (there will be Done games), default to Done, hide/disable the Ongoing sub-tab
  when no live game.
- **Risk:** `computeBracketLayout` / Final-as-block for spectator mode — needs a
  code check; may need a small layout tweak.
- **Risk:** whether `ClosedMatchBetsSelector` already includes knockout games —
  determines how much of sec 3+5 is pure reuse vs. a wrapper/filter.

## Status — IMPLEMENTED (pending manual verification)

Both risk items verified (tree blocks already render actual teams; closed-bets
selector returns all games → filter by `is_knockout`). Built:

- `BracketProvider.tsx` — branch on `IsTournamentStarted` →
  `BracketStartedView` (post-start) vs `BracketWinnerFlow` (pre-start, unchanged).
- `bracket/BracketStartedView.tsx` (new) — 2 buttons (Bracket / Winner-table
  modals) + 2 tabs (My bets default + notification dot; Games + live pulse dot).
- `bracket/BracketSpectatorView.tsx` (new) — actual-teams bracket for the modal.
- `bracket/BracketTree.tsx` — added `spectator` prop (read-only final area).
- `bracket/ContestantPicksTable.tsx` (new) — name | winner | runner-up table.
- `_selectors/closedMatchBets.ts` — added `KnockoutClosedMatchBetsSelector`.
- `matches/KnockoutClosedMatchBetsProvider.tsx` (new) — reuses `MatchesView`.
- `widgets/Tabs/types.ts` — `TabDescription.label` now `ReactNode` (badge labels).
- `Bracket.scss` — started-view actions, pulse keyframes, modal close, picks table.
- en/he `knockout_bracket.json` — `startedView.*` + `picksTable.*` keys.

Decision applied for the minor open question: Games tab always present;
`MatchesView` already defaults to its Live sub-tab and shows an empty Live list
when no game is running (acceptable for v1; can hide the Live sub-tab later).

## Suggested build order

1. Branch + empty `BracketStartedView` shell (2 buttons, 2 tabs, modals wired).
2. Tab "My Bets" = `BracketGamesList` + notification dot. (cheap, high value)
3. Tab "Games" = reuse classic Games view scoped to knockout (sec 3+5).
4. W/RU modal `ContestantPicksTable` (sec 4).
5. Spectator bracket modal (sec 1) — most effort, do last.
6. Pulse animation polish.
