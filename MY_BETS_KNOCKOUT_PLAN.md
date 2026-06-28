# My/His Bets — Knockout-Bracket Game Bets

Support knockout-bracket game bets in **My Bets**, **His Bets**, and **ExpandedContestantView**,
replacing the current "hide game bets for knockout bracket" stopgap.

## Decisions (locked)

- **Game scope:** show *all* bracket ties, joining in the contestant's bet where one exists
  (un-bet ties still appear with an empty bet cell). Not bet-centric like today.
- **Badge source:** the badge marks the team that *this contestant* predicted as
  Winner / Runner-up — same source the bracket card uses (`WinnerBetByUtlId` /
  `RunnerUpBetByUtlId`), keyed by the viewed `utlId`. In His-Bets / expanded row it
  reflects that person's picks.
- **Off-mode UI:** reuse the existing `id / date / bet / result / score` table; swap only
  the **bet** and **result** cell renderers. No standalone card list.
- **Auto-bet:** rows where the bet `is_auto_bet` keep the bot icon + tinted background in
  **both** modes (the `AutoBetBadge` + `GameBetsTable-autoBet` styling that
  `MatchResultView` already applies). Must be propagated through the new qualifier renderer.

## Two render modes (per `IsCurrentTournamentIncludesBetOnResult`)

### Result-bet ON
Essentially today's `GameBetsTable` + `MatchResultView`, **plus** a Winner/Runner-up badge on
the relevant team. Scores + qualifier `✌️` stay as-is.

### Result-bet OFF (new qualifier-only renderer)
No scores exist. Each row shows the qualifier pick, not a scoreline.
- **Bet cell:** the contestant's picked qualifier — highlight the picked team, show the
  W/RU badge on it if applicable. The non-picked team is de-emphasized.
- **Result cell** ("result-like" UI): the *actual* qualifier (`getQualifierSide(match)`).
  Non-qualified team rendered at reduced opacity; qualifier marked with an advance/check icon.
  Empty until the tie is decided.

## Open decision — data source for "all bracket ties"

The contestant's bets come from `MatchBetsByUserId[utlId]` (His/Expanded) and
`MyBetsSelector.matchBets` (My). Both are **bet-centric** (only ties the contestant bet on).
To show *all* ties we left-join bets onto a game list. Which game list?

- **Option A — knockout `Match`es (`MatchesWithTeams`, `is_knockout`).** Carries real scores,
  `is_done`, `full_result`, works with `getQualifierSide`. **Only includes ties with known
  teams** (scheduled). Simplest; reuses existing row shape `{match, bet?}`.
- **Option B — full bracket (`CurrentBracketGames`, contract D).** Includes not-yet-drawn ties
  as slot tokens ("1A vs 2B"), but lacks full scoreline fields and needs new placeholder-row
  rendering for teamless ties.

**Recommendation: Option A.** "Missing bet" games (teams known, contestant didn't bet) show up,
which is the useful case; genuinely undrawn future ties stay in the dedicated bracket view where
slot tokens belong. Confirm before I build.

## Implementation sketch (assuming Option A)

1. **Row model.** New selector(s) producing per-utl `{ match: Match, bet?: MatchBet }[]` over
   knockout matches, ordered by round/start_time. Likely in `_selectors/logic/` joining
   `MatchesWithTeams` (knockout) with `MatchBetsByUserId`.
2. **W/RU roles.** Helper resolving `homeRole`/`awayRole` per match from the viewed contestant's
   `WinnerBetByUtlId` / `RunnerUpBetByUtlId` (via `bracketSpecialRole`).
3. **Table.** Knockout-aware variant of `GameBetsTable` (or a branch inside it) that:
   - renders the result-ON cells through `MatchResultView` + a new badge slot;
   - renders the result-OFF cells through a new `QualifierBetView` / `QualifierResultView`
     widget (picked team + badge; opacity + advance icon), forwarding `isAutoBet`.
4. **Wire-up.** Replace the three `isKnockoutBracket ? [] : matchBets` stopgaps:
   - `MyBetsView.tsx:23`, `HisBetsView.tsx:36` → render the knockout games table when bracket.
   - `ExpandedContestantView` `GameBetsView` (`:103`, `:161`) → same table; keep group tab hidden.
     Re-enable the "full form" link for bracket (`:153`) — TBD, currently hidden.
5. **Badge component.** Small reusable Winner/Runner-up badge (🏆 / 🥈 + localized text),
   shared with how `BracketGameCard` / `KnockoutClosedBetsPage` label roles.

## Files in play

- `frontend/src/myBets/GameBetsTable.tsx` — cell renderers (core change)
- `frontend/src/myBets/MyBetsView.tsx`, `frontend/src/myBets/HisBetsView.tsx` — un-stopgap
- `frontend/src/leaderboard/ExpandedContestantView.tsx` — un-stopgap + link
- `frontend/src/widgets/MatchResult/MatchResultView.tsx` (+ `.scss`, `types.ts`) — badge slot,
  reference for auto-bet styling
- new: qualifier bet/result widgets, W/RU badge, join selector
- `frontend/src/_selectors/logic/winnerBet.ts` (`WinnerBetByUtlId`/`RunnerUpBetByUtlId`)
- `frontend/src/utils/bracket.ts` (`bracketSpecialRole`), `frontend/src/utils/matches.ts`
  (`getQualifierSide`)
