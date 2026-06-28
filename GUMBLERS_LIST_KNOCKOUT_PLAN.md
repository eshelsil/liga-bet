# GumblersList — knockout-bracket adjustments (ongoing/done games)

Scope: the **predictions tab** of an ongoing/done game = `matches/GameGumblersList.tsx`
(rendered via `matches/GameDataView.tsx`). Must NOT change behavior for classic tournaments.

Gate all new behavior on `IsCurrentTournamentKnockoutBracket` (Contract A; absent type === classic).

## Change 1 — Winner / Runner-Up emoji next to a gumbler's name

Same user list and auto-bet view as today. Additionally, for each gumbler, if one of the
**two teams playing in this game** is that user's tournament Winner pick → show 🏆 next to
their name; if it's their Runner-Up pick → show 🥈.

Data: each user's special picks come from
- `WinnerBetByUtlId` → `Record<utlId, QuestionBetWithRelations | undefined>`, `.answer.id` = team id
- `RunnerUpBetByUtlId` → same shape

Both already in store (primal bets), keyed by `user_tournament_id`, already exported from `@/_selectors`.

Plan:
1. In `GameGumblersList`, read both selectors (only when knockout bracket).
2. For each gumbler (utlId), compute role vs THIS game's `home_team.id` / `away_team.id`:
   - winner pick team ∈ {home,away} → `'winner'`
   - else runner-up pick team ∈ {home,away} → `'runnerUp'`
   - else `null`
3. Add optional `specialRole?: 'winner' | 'runnerUp'` to the `Gumbler` interface
   (`gumblersList/GumblersList.tsx`).
4. In `GumblerRow`, render 🏆/🥈 inline after the name when `specialRole` set
   (with a `title` for accessibility). Emoji are locale-independent → no namespace coupling.

Classic tournaments: selectors are simply not read / role stays undefined → no visual change.

## Change 2 — Result bet off → show winner team flag instead of the result view

When the tournament has result betting off (`IsCurrentTournamentIncludesBetOnResult === false`)
**and** it's a knockout bracket, the "prediction" column should render **just the winning team's
flag** instead of `MatchResultV2` (home flag + score − away flag + score + ✌️).

Winner team = qualifier side: `getWinnerSide(resultHome, resultAway, qualifier)` → pick
`home_team` / `away_team`. (With result bet off there is no meaningful score, so rely on
`bet.qualifier`.) Render a bare `TeamFlag` — no score, no ✌️ qualifier mark.

When result bet is ON (default), keep `MatchResultV2` exactly as today.

## Files touched
- `matches/GameGumblersList.tsx` — compute roles, conditional prediction-cell render
- `gumblersList/GumblersList.tsx` — `specialRole` field + emoji render in `GumblerRow`

## Resolved
- Emoji appears ONLY when the user's W/RU pick is one of the two teams in THIS game. ✅

## Status: implemented
- `gumblersList/GumblersList.tsx` — `specialRole` field + 🏆/🥈 render in `GumblerRow`.
- `matches/GameGumblersList.tsx` — per-utl role from `WinnerBetByUtlId`/`RunnerUpBetByUtlId`
  (knockout only); result-bet-off prediction cell renders bare winner `TeamFlag`.
