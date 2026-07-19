# Actual Final on Top of the Bracket View

## Goal
In the read-only bracket (post-start "Bracket" modal → `BracketSpectatorView` → `BracketTree`),
show the **actual** final at the **top** of the tree, mirroring the user's **picks** at the bottom.
Also add green ✓ feedback to the bottom picks when they come true.

## Locked decisions
- **Top layout:** vertical mirror — champion (🏆) at the very top, the two actual finalists below it,
  then connectors down into the semi-finals / tree.
- **Reveal threshold:** show the two actual finalists as soon as both are known (final fixture set);
  the champion 🏆 fills in only once the final is played.
- **Scope:** only the read-only spectator bracket (the interactive picker is pre-start, so no actual final exists there — it naturally never shows a top area).

## Labels
- **Top (actual)** frames: `final.title` = "Final" / "גמר", `special.winner` = "Winner" / "אלופה" (existing keys).
- **Bottom (picks)** frames renamed:
  - `final.picksTitle` = "Finalists pick" / "בחירת הפיינליסטיות" (new)
  - `special.winnerPick` = "Winner pick" / "בחירת האלופה" (new)

## Green ✓ / red ✕ on the bottom picks
Reusing existing badges (`.Slot-advanceCheck` green ✓, `.Slot-elimX` red ✕):
- **Finalist pick slot:** green ✓ if that picked team is one of the two actual finalists (reached the final).
  (Existing: red ✕ when eliminated — mutually exclusive with reaching the final.)
- **Winner pick slot (trophy):** green ✓ if the picked winner is the actual champion.

## Data source
The `FINAL` game already carries everything (`useBracket().games`):
- `home_team` / `away_team` → who actually reached the final.
- `actual_qualifier_side` + `is_done` → the actual champion.
Left/right placement of the actual finalists via `getTeamSide(games, teamId)` so the top mirror aligns
with the correct tree halves.

## Files
1. `bracketLayout.ts` — add a top mirror area. New `hasTopFinal` arg; shift the whole tree down by just
   enough so the top area (🏆 → finalists → down to semis) fits above the semi-finals. New layout outputs:
   `topFinalists`, `topWinnerPos`, `topFinalFrame`, `topWinnerFrame`, plus top connectors merged into `connectors`.
   Geometry mirrors the bottom (`SF_TO_FINAL`, `FINAL_TO_WINNER`, frame pads) but stacked champion-first.
2. `BracketTree.tsx` — new optional `actualFinal` prop `{ leftTeam, rightTeam, championSide }`.
   Render the top area (read-only, no edit/plus). Add green ✓ to bottom finalist picks (reached final) and
   the bottom winner pick (won). Rename bottom frame titles. `hasTopFinal` gates the top render + layout.
3. `BracketSpectatorView.tsx` — derive `actualFinal` from the `FINAL` game and pass it in.
4. `i18n/.../knockout_bracket.json` (he + en) — add `final.picksTitle`, `special.winnerPick`.
5. `Bracket.scss` — reuse existing frame/slot/badge classes; add tweaks only if the top mirror needs them.

## Notes / follow-ups
- Backend scoring bug already tracked separately (runner-up pick that wins the final is overpaid).
