# Final Match — Behavior Spec (Live + Post-Conclusion)

**Purpose:** Describe what the app *is supposed to do* during the tournament's final match and after
it concludes, so the behavior can be verified manually. Everything below is derived from the current
code. Where a behavior is **built but disabled**, **missing**, or a **known bug**, it is flagged
explicitly — those are the items that most need a product decision before manual testing.

Scope: this covers both tournament types, but the "final match" concept is richest for
`knockout_bracket`. For classic tournaments the "final" is still the game whose `sub_type === FINAL`.

---

## 0. Vocabulary & state signals (how the code knows "the final")

| Concept | Where it lives | Meaning |
|---|---|---|
| The final game | `Game.sub_type === "FINAL"` (`app/Enums/GameSubTypes.php:8`); FE `KnockoutStage.Final` / `GameSubType.Final` | The single tie whose winner is the champion |
| Get the final | BE `Competition::getFinalGame()` (`app/Competition.php:316`); FE `FinalGame` selector (`_selectors/modelRelations/matches.ts:47`) | |
| Match not started | `start_time > now` | Scheduled |
| Match **live/ongoing** | `start_time < now && !is_done` — BE `Game::isLive()` (`app/Game.php:213`), FE `isGameLive()` (`utils/matches.ts:20`) | The "during the match" state |
| Match ended | `is_done === true` | |
| **Final is live** | `IsFinalGameLiveSelector` (`_selectors/logic/liveQuestionBets.ts:9`) = `isGameLive(finalGame)` | The gate that turns on "live awards" (below) |
| **Tournament over** | `IsCompetitionDone` (`_selectors/modelRelations/matches.ts:54`) = `FinalGame.is_done`; BE `Competition::isDone()` (`app/Competition.php:330`) | The only real "after the final" signal in the app |

> **Key fact:** There is **no** `IsTournamentEnded`/`IsTournamentFinished` UI state. `isTournamentStarted`
> is `true` for both *ongoing* and *finished* tournaments (`utils/tournament.ts:6`). So today almost every
> page renders a *finished* tournament identically to an *in‑progress* one. The only "after the final"
> signal the frontend actually consumes is `IsCompetitionDone`, and it is used in just two places
> (MVP wait dialog + the disabled congrats animation).

There is **no stored match-status enum**. Status is always derived from `start_time` + `is_done`.
The live clock is a single free-text field `match.minute` ("87'", "45+2'", "HT", "Pen."), sourced from
365scores `gameTimeDisplay` (`app/DataCrawler/Crawler.php:885`), persisted every crawl
(`app/Actions/UpdateCompetition.php:264`), and cleared to `null` when the game is done.

Live data refresh: the backend poller `liga-bet:update-running-competitions` runs **every minute**
(`app/Console/Kernel.php:28`). The client refreshes via `useLiveUpdate()`
(`hooks/useLiveUpdate.ts`) — refetches games, leaderboard, game bets, goals data, primal bets, and
special questions — triggered by the manual refresh button on the matches view
(`matches/MatchesView.tsx:51`) and by `useMissingPlayersFetcher` when live games exist.

---

## 1. DURING the ongoing final match (live)

### 1.1 Live score & clock (applies to every live game, including the final)
- `matches/GameHeader.tsx:84` shows the live `minute` badge **only** when `isLive && match.minute`.
- Score rows shown: `result_home/away`, plus extra-time (`full_result_*`) and aggregate
  (`agg_result_*`) rows when present.
- The final appears under the **Live** tab of the matches view (`LiveGamesView`,
  `matches/MatchesView.tsx:44`), separate from the **Finished** tab.
- **Verify:** during the live final, the minute badge ticks, the score updates on refresh, and the
  game sits in the Live tab. When `is_done` flips, the minute disappears and the game moves to Finished.

### 1.2 Live "top scorer" & "most assists" awards — go live **only during the final**
This is the headline behavior the request calls out ("live score includes top scorer & most assists
final results").

- The provisional top-scorer / most-assists **award holders** (`LiveTopScorersAnswer`,
  `LiveTopAssistsAnswer`, `_selectors/logic/liveQuestionBets.ts:103/117`) return a non-empty result
  **only when `IsFinalGameLiveSelector` is true** — i.e. only while the final is being played.
  Before/between earlier matches these stay empty.
- Computation while the final is live:
  - `LiveScorersById` (`:86`) = each player's **stored season totals** (`Player.goals/assists`,
    written only for *done* games) **plus live per-game deltas** from currently-live games
    (`LiveGoalsDataByPlayerId`, `:63`, summed from `GameDataGoal` rows / `match.scorers`).
  - The live award = the player(s) with the max goals / max assists (`maxBy`), **ties included**
    (all players sharing the max are returned).
- These provisional answers are surfaced to the leaderboard through `LiveSpecialAnswers` (`:384`):
  - `topScorer` question → current live top scorer(s)
  - `topAssists` question → current live most-assists player(s)
  - **Verify:** as goals/assists are entered during the live final, the displayed live top scorer /
    most assists leader updates, and reflects ties (multiple players) correctly.

### 1.3 Live winner / runner-up (bracket) while the final is live
Also inside `LiveSpecialAnswers` (`:407`), gated on the final being live:
- The provisional **Winner** = the finalist currently on the qualifying side of the final
  (`getQualifierSide(finalGame)` → home/away team); the **Runner-Up** = the other finalist.
- **Verify:** flipping the live score of the final (who's currently winning) flips the provisional
  Winner/Runner-Up shown on the leaderboard's expanded contestant view.

### 1.4 Live leaderboard / provisional points during the final
The leaderboard folds live deltas into each contestant's score
(`_selectors/leaderboard.ts:60`, `utils/liveScores.ts`) and re-ranks live. Provisional special-bet
points during the final:
- **Top scorer bets** (`LiveTopScorerBetsWithScore`, `:302`): while the final is live **all**
  top-scorer bets are considered (`LiveTopScorerBets` returns every bet when final is live, `:207`);
  provisional points = `goals × topScorer.eachGoal` **plus** `topScorer.correct` if that player is a
  current live leader.
- **Most-assists bets** (`LiveTopAssistsBetsWithScore`, `:328`): symmetric, gated additionally on the
  most-assists question being enabled.
- **Winner bets** (`LiveWinnerBetsWithScore`, `:246`): provisional points for a bet whose team is on
  the live qualifying side of its current knockout game (works for the final and any live knockout leg).
- **Runner-Up bets — deliberately NOT scored live during the final:** `LiveRunnerUpBets` returns `{}`
  when `IsFinalGameLive` is true (`:173`). So a runner-up bet earns **no** provisional points while the
  final is in progress (even though the provisional Runner-Up *answer* is displayed per 1.3).
  **Verify / decide:** confirm this asymmetry (live Winner points update during the final, live
  Runner-Up points do not) is intended.
- Expanded contestant view consumes these via `liveAnswersByQuestionId`
  (`leaderboard/ExpandedContestantView.tsx:126`).

> **Note (non-final live games):** outside the final, top-scorer/most-assists bets are still scored
> live, but only for players whose **team is currently playing** (`LivePlayingTeams`), and the live
> *award holder* is not shown. The "everything goes live" behavior is unique to the final.

---

## 2. WHEN the final concludes (`is_done` flips to true)

Backend resolution happens in the per-minute crawl (`app/Actions/UpdateCompetition.php`) /
`UpdateCompetitionScorers.php`:

### 2.1 Champion & Runner-Up resolved automatically
- On a done final (`isLastLeg()` && `sub_type === "FINAL"`, `UpdateCompetition.php:281`):
  - `winner = game.ko_winner`; `runnerUp` = the other finalist.
  - `TYPE_WINNER` and `TYPE_RUNNER_UP` special-bet answers are set and scored.
- `SpecialBet::getChampions()` → `getFinalGame()->getKnockoutWinner()`;
  `getRunnerUp()` → `getKnockoutLoser()` (`app/SpecialBets/SpecialBet.php:72`).
- **Verify:** after the final is done, the tournament Winner and Runner-Up questions show the real
  finalists and all Winner/Runner-Up bets settle to final points.

### 2.2 Top scorer & most assists resolved automatically
- `UpdateCompetitionScorers.php:120-137`: for the now-done final, each player's `goals`/`assists`
  season totals are recomputed, then `getTopScorersIds()` / `getMostAssistsIds()` resolve and the
  `TYPE_TOP_SCORER` / `TYPE_MOST_ASSISTS` bets are scored.
- These awards are only *scored on the FINAL game*
  (`app/Bets/BetSpecialBets/BetSpecialBetsRequest.php:311/327/385`).
- **Verify:** the provisional live top-scorer/most-assists (section 1.2) become the *settled* answers,
  and their bets settle to final points.

### 2.3 MVP is **NOT** automatic — requires an admin announcement
- MVP has no data feed. It is set by an admin form (`admin/tools/views/AdminSetMvp.tsx` →
  `announceMvp` → `AdminController::announceMVP()`, `routes/web.php:78`).
- Until the admin announces it, `IsMissingMvpAnswer` is true and, because the competition is done,
  `IsWaitingForMissingMvpAnswer` (`_selectors/logic/missingMvpBet.ts:19`) is true.
- **Effect on the leaderboard:** when the user opens the leaderboard and the MVP is still missing, the
  **"Wait for MVP" dialog** opens automatically (`leaderboard/LeaderboardProvider.tsx:40`;
  `dialogs/WaitForMvp/WaitForMvpDialog.tsx`) — an info dialog ("MVP not announced yet"), single
  "OK, got it" button. It is **not** a reveal/celebration.
- **Gate on celebration:** the congrats animation is intentionally blocked until MVP is answered
  (`ShouldShowCongrats` requires `!isMvpMissing`, `_selectors/congratsAnimation.ts:18`). So the
  intended sequence is: final done → (admin announces MVP) → celebration eligible.
- **Verify / decide:** confirm the intended operator flow is "admin manually announces MVP after the
  final," and that the wait dialog is the only user-facing MVP treatment until then.

---

## 3. Congratulations / celebration after the tournament ends

### 3.1 What is built (`leaderboard/animations/CongratsAnimation.tsx`)
A full rank-based celebration sequence exists:
- **Rank 1:** confetti canvas (`confetti-js`) → money bags animate in → **trophy showing the winner's
  name** → diploma summary card. "Claim prize" button for ranks ≤ 4.
- **Rank 2:** two money bags → diploma. **Rank 3:** one money bag → diploma. **Rank 4:** dollar →
  diploma. **Rank ≥ 5:** diploma only.
- Diploma text is rank-specific i18n (`i18n/locales/{en,he}/leaderboard.json` `congrats.*` —
  e.g. "Champion of champions", "You finished last").
- Assets: `/img/money.png`, `/img/trophy.png`, `/img/dollar.png`, `/img/diploma.jpg`.
- "Seen" state persists to `localStorage['LigaBetSeenCongratsAnimation']` per tournament; re-shows only
  if not seen in the last 3 days.

### 3.2 Gating logic (`_selectors/congratsAnimation.ts`, already implemented)
`ShouldShowCongrats` is true when **all** of:
1. `IsCompetitionDone` (final is done), **and** MVP is answered (`!isMvpMissing`);
2. the user is viewing the **latest** leaderboard version (not a historic snapshot);
3. not seen in the last ~3 days;
4. `isOurTournament` **or** the current user's rank === 1.

### 3.3 ⚠️ Currently DISABLED — the single most important gap
`CongratsAnimationProvider` is **commented out** at `leaderboard/LeaderboardProvider.tsx:68`
(`{/* <CongratsAnimationProvider /> */}`), even though it is imported. The animation ships in the
bundle but **never renders**. Re-enabling is a one-line change; all gating already exists.

- **Decision needed:** should the celebration be enabled for the final? If yes, uncomment line 68 and
  test the full rank-1..≥5 sequence plus the MVP-answered gate and the 3-day "seen" throttle.

---

## 4. How each page looks after the final concludes

Reality today: only `IsCompetitionDone` distinguishes "after the final," and it is consumed in just
two spots. Below is the *current* behavior per page, with the gaps a product decision must resolve.

| Page / route | After final concludes — current behavior | Gap / decision |
|---|---|---|
| **Leaderboard** `/leaderboard` (`leaderboard/LeaderboardProvider.tsx`) | Same table as mid-tournament. Rankings/scores are now fully settled (no live deltas — final is done). If MVP missing → **Wait-for-MVP dialog** auto-opens. Congrats animation would fire **if enabled** and MVP answered. Prize theming by rank still applies. | No "final standings / tournament over" banner or frozen-state indicator. Celebration disabled (§3.3). |
| **Open matches / Bracket** `/open-matches` (`bracket/BracketProvider.tsx` / `open_matches/openMatchesProvider.tsx`) | Branches only on `IsTournamentStarted` → renders `BracketStartedView` (tabs My bets / Games, spectator bracket, picks table) exactly as mid-tournament. `BracketStartedView` does **not** branch on `IsCompetitionDone`. | **No post-final champion reveal / results podium.** `BracketPodium` only shows the *user's own* Winner/Runner-Up **pick**, never the actual outcome. Decide whether a real-result champion reveal is wanted. |
| **My Bets** `/my-bets` (`myBets/MyBetsView.tsx`) | Branches only on knockout-vs-classic; all bets are now settled per-game. No finished-state branch. | No "final results" summary of the user's own outcome. |
| **Open questions** `/open-questions`, **Group standings** `/open-group-standings` (classic) | Settled; no finished-specific branch. | — |
| **Closed bets** `/closed-bets` | Shows settled per-round scoring (`closedBets/…`). | — |
| **Nav menu** (`appHeader/TournamentMenuItems.tsx`) & **default landing** (`hooks/useDefaultPageRedirect.tsx`) | Finished tournament renders the **identical** menu to ongoing and lands on the **leaderboard**. | No distinct finished navigation. |

> Net: the app has a genuine "after the final" signal (`IsCompetitionDone`) but currently expresses it
> only via the MVP wait dialog and the (disabled) congrats animation. Any richer per-page "tournament
> over" layout — final-standings banner, champion reveal on the bracket, MVP/top-scorer award reveal,
> season summary — would be **new** behavior, not documented existing behavior. These are the items to
> confirm as in-scope before manual testing.

---

## 5. Known issues relevant to the final

- **Runner-Up finalist-bonus overpay (bracket).** The Finalist/advance bonus over-pays a *Runner-Up*
  pick that then *wins* the final; it should cap at "reached the final" (winner-only credit for the
  FINAL round). See memory `bracket-runnerup-final-bonus-bug`. Verify the final-round scoring for a
  Runner-Up pick who becomes champion.
- **No `IsTournamentFinished` UI state / dead code.** `isTournamentDone` (`utils/tournament.ts:196`)
  is defined but unused. If per-page finished states are wanted, this is the natural hook to build on.

---

## 6. Manual test checklist (condensed)

**During live final**
- [ ] Live minute badge + score update on refresh; final sits in Live tab.
- [ ] Top-scorer & most-assists live award holders appear (only now, not before the final), with ties.
- [ ] Provisional Winner/Runner-Up follow the live score of the final.
- [ ] Leaderboard re-ranks live; top-scorer/most-assists/winner bet points update live.
- [ ] Runner-Up bet points do **not** update live during the final (confirm intended).

**On conclusion (`is_done`)**
- [ ] Winner & Runner-Up settle to real finalists; bets settle.
- [ ] Top scorer & most assists settle; bets settle.
- [ ] MVP still shows as "waiting" until admin announces; Wait-for-MVP dialog opens on leaderboard.

**After admin announces MVP**
- [ ] MVP bets settle.
- [ ] (If congrats enabled) rank-based celebration fires once, respects 3-day throttle & latest-version gate.

**Per-page**
- [ ] Confirm whether each page should look different when finished (currently only leaderboard's MVP
      dialog + optional congrats differ).
