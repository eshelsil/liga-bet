import { createSelector } from 'reselect'
import { BracketScoreConfig, QuestionBetWithRelations, WinnerSide } from '../../types'
import {
    BracketSpecialRole,
    calcBracketGameBetScore,
    getQualifierSide,
    isTeamParticipate,
    knockoutStageToSubType,
    roleForRound,
    valuesOf,
} from '../../utils'
import {
    BracketScoresConfigSelector,
    IsCurrentTournamentIncludesBetOnResult,
    LiveGames,
} from '../base'
import { LiveGameBets } from '../modelRelations'
import { WinnerBetsById, RunnerUpBetsById } from './liveQuestionBets'

// Provisional specialAdvance points: the user's Winner/Runner-Up team is currently the
// qualifying side of a live game. On the FINAL a Runner-Up pick has already fulfilled
// its road — reaching the final *is* the runner-up prediction — so only the Winner pick
// earns the final bonus. `roleForRound` encodes that rule (also nulls THIRD_PLACE, which
// carries no specialAdvance anyway), matching the badge logic and the finalized backend.
function liveSpecialAdvancePoints(
    teamId: number,
    liveGames: any[],
    bracket: BracketScoreConfig,
    role: BracketSpecialRole,
): number {
    for (const game of liveGames) {
        if (!isTeamParticipate(game, teamId)) continue
        const teamSide = game.home_team === teamId ? WinnerSide.Home : WinnerSide.Away
        if (getQualifierSide(game) !== teamSide) continue
        const round = knockoutStageToSubType(game.subType)
        if (!round || roleForRound(role, round) === null) return 0
        return bracket.specialAdvance?.[round] ?? 0
    }
    return 0
}

/**
 * Per-utl live specialAdvance points split by pick (Winner vs Runner-Up), so the UI can
 * badge each flag on its own. A Runner-Up pick on the FINAL contributes 0 (see above).
 * Returns {} when the tournament has no bracket scoring config (i.e. classic).
 */
export const LiveBracketSpecialAdvanceByUtlId = createSelector(
    WinnerBetsById,
    RunnerUpBetsById,
    LiveGames,
    BracketScoresConfigSelector,
    (
        winnerBets,
        runnerUpBets,
        liveGamesById,
        bracket,
    ): Record<number, { winner: number; runnerUp: number }> => {
        if (!bracket) return {}
        const liveGames = valuesOf(liveGamesById)
        const byUtl: Record<number, { winner: number; runnerUp: number }> = {}
        const ensure = (utlId: number) =>
            (byUtl[utlId] = byUtl[utlId] ?? { winner: 0, runnerUp: 0 })

        // These raw bet selectors are NOT gated by the classic special-question flags,
        // so they stay populated for knockout tournaments.
        for (const bet of valuesOf(winnerBets)) {
            const teamId = bet.answer?.id
            if (teamId == null) continue
            const points = liveSpecialAdvancePoints(teamId, liveGames, bracket, 'winner')
            if (points) ensure(bet.user_tournament_id).winner += points
        }
        for (const bet of valuesOf(runnerUpBets)) {
            const teamId = bet.answer?.id
            if (teamId == null) continue
            const points = liveSpecialAdvancePoints(teamId, liveGames, bracket, 'runnerUp')
            if (points) ensure(bet.user_tournament_id).runnerUp += points
        }
        return byUtl
    },
)

/**
 * Winner / Runner-Up special bets carrying their LIVE specialAdvance addition, grouped
 * by utl — shaped like the classic `Live*BetsWithScoreByUtlId` selectors so it can feed
 * `ContestantSelector`'s liveQuestionBets. Each bet's `score` = static score + the live
 * specialAdvance it's currently earning; a pick with no live contribution is omitted, so
 * the Special Bets table only shows a `(+N)` when there's an actual live gain.
 */
export const LiveBracketQuestionBetsByUtlId = createSelector(
    WinnerBetsById,
    RunnerUpBetsById,
    LiveBracketSpecialAdvanceByUtlId,
    (
        winnerBets,
        runnerUpBets,
        advanceByUtl,
    ): Record<number, QuestionBetWithRelations[]> => {
        const byUtl: Record<number, QuestionBetWithRelations[]> = {}
        const addBet = (bet: QuestionBetWithRelations, added: number) => {
            if (!added) return
            const utlId = bet.user_tournament_id
            ;(byUtl[utlId] = byUtl[utlId] ?? []).push({
                ...bet,
                score: (bet.score || 0) + added,
            })
        }
        for (const bet of valuesOf(winnerBets)) {
            addBet(bet, advanceByUtl[bet.user_tournament_id]?.winner ?? 0)
        }
        for (const bet of valuesOf(runnerUpBets)) {
            addBet(bet, advanceByUtl[bet.user_tournament_id]?.runnerUp ?? 0)
        }
        return byUtl
    },
)

/**
 * Live (in-progress) bracket points per user-tournament-id, added on top of the
 * server's static leaderboard. The bracket scoring lives entirely here — separate
 * from the classic live-scoring selectors — so the two never interleave (the
 * `LiveScoreboard` switch in scoreboard.ts picks one path by tournament type).
 * Returns {} when the tournament has no bracket scoring config (i.e. classic).
 */
export const LiveBracketScoreByUtlId = createSelector(
    LiveGameBets,
    LiveBracketSpecialAdvanceByUtlId,
    BracketScoresConfigSelector,
    IsCurrentTournamentIncludesBetOnResult,
    (
        liveGameBets,
        specialAdvanceByUtl,
        bracket,
        isResultBetOn,
    ): Record<number, number> => {
        if (!bracket) return {}
        const added: Record<number, number> = {}
        const add = (utlId: number, points: number) => {
            if (!points) return
            added[utlId] = (added[utlId] ?? 0) + points
        }

        // Qualifier picks + exact-score result bonus (when result betting is on) on live
        // games — mirrors the backend calculateBracket per-prediction scoring.
        for (const bet of valuesOf(liveGameBets)) {
            add(
                bet.user_tournament_id,
                calcBracketGameBetScore({
                    game: bet.relatedMatch,
                    resultHome: bet.result_home,
                    resultAway: bet.result_away,
                    qualifier: bet.winner_side,
                    bracket,
                    isResultBetOn,
                }),
            )
        }

        // Winner / Runner-Up advancing through a live game (specialAdvance), already
        // gated per pick (FINAL is Winner-only).
        for (const [utlId, pts] of Object.entries(specialAdvanceByUtl)) {
            add(Number(utlId), pts.winner + pts.runnerUp)
        }

        return added
    },
)
