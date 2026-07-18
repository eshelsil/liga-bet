import { createSelector } from 'reselect'
import { BracketScoreConfig, MatchBetWithRelations, WinnerSide } from '../../types'
import {
    getQualifierSide,
    getWinnerSide,
    isTeamParticipate,
    knockoutStageToSubType,
    valuesOf,
} from '../../utils'
import {
    BracketScoresConfigSelector,
    IsCurrentTournamentIncludesBetOnResult,
    LiveGames,
} from '../base'
import { LiveGameBets } from '../modelRelations'
import { WinnerBetsById, RunnerUpBetsById } from './liveQuestionBets'

// Provisional qualifier points for a single live knockout game bet — mirrors the
// finalized scoring in BracketGameCard, but keyed on the live qualifier side.
function liveQualifierPoints(bet: MatchBetWithRelations, bracket: BracketScoreConfig): number {
    const game = bet.relatedMatch
    if (!game?.is_knockout) return 0
    const koWinnerSideBet = game.isTwoLeggedTie
        ? bet.winner_side
        : getWinnerSide(bet.result_home, bet.result_away, bet.winner_side)
    const gameQualifier = getQualifierSide(game)
    if (gameQualifier == null || gameQualifier !== koWinnerSideBet) return 0
    const round = knockoutStageToSubType(game.subType)
    return round ? (bracket.qualifier?.[round] ?? 0) : 0
}

// Provisional perfect-result bonus for a single live knockout game bet — mirrors the
// finalized `calculateBracket` result tier, keyed on the game's current live score.
// Only relevant when result betting is on; a qualifier-only bet (no predicted score)
// or a mismatch against the live score earns nothing.
function liveResultPoints(bet: MatchBetWithRelations, bracket: BracketScoreConfig): number {
    const game = bet.relatedMatch
    if (!game?.is_knockout) return 0
    if (bet.result_home == null || bet.result_away == null) return 0
    if (game.result_home == null || game.result_away == null) return 0
    if (game.result_home !== bet.result_home || game.result_away !== bet.result_away) {
        return 0
    }
    const round = knockoutStageToSubType(game.subType)
    return round ? (bracket.result?.[round] ?? 0) : 0
}

// Provisional specialAdvance points: the user's Winner/Runner-Up team is currently
// the qualifying side of a live game.
function liveSpecialAdvancePoints(
    teamId: number,
    liveGames: any[],
    bracket: BracketScoreConfig,
): number {
    for (const game of liveGames) {
        if (!isTeamParticipate(game, teamId)) continue
        const teamSide = game.home_team === teamId ? WinnerSide.Home : WinnerSide.Away
        if (getQualifierSide(game) === teamSide) {
            const round = knockoutStageToSubType(game.subType)
            return round ? (bracket.specialAdvance?.[round] ?? 0) : 0
        }
    }
    return 0
}

/**
 * Live (in-progress) bracket points per user-tournament-id, added on top of the
 * server's static leaderboard. The bracket scoring lives entirely here — separate
 * from the classic live-scoring selectors — so the two never interleave (the
 * `LiveScoreboard` switch in scoreboard.ts picks one path by tournament type).
 * Returns {} when the tournament has no bracket scoring config (i.e. classic).
 */
export const LiveBracketScoreByUtlId = createSelector(
    LiveGameBets,
    WinnerBetsById,
    RunnerUpBetsById,
    LiveGames,
    BracketScoresConfigSelector,
    IsCurrentTournamentIncludesBetOnResult,
    (
        liveGameBets,
        winnerBets,
        runnerUpBets,
        liveGamesById,
        bracket,
        isResultBetOn,
    ): Record<number, number> => {
        if (!bracket) return {}
        const liveGames = valuesOf(liveGamesById)
        const added: Record<number, number> = {}
        const add = (utlId: number, points: number) => {
            if (!points) return
            added[utlId] = (added[utlId] ?? 0) + points
        }

        // Qualifier picks on live games, plus the exact-score result bonus when result
        // betting is on (mirrors the backend calculateBracket: qualifier + result tier).
        for (const bet of valuesOf(liveGameBets)) {
            add(bet.user_tournament_id, liveQualifierPoints(bet, bracket))
            if (isResultBetOn) {
                add(bet.user_tournament_id, liveResultPoints(bet, bracket))
            }
        }

        // Winner / Runner-Up advancing through a live game (specialAdvance). These
        // raw bet selectors are NOT gated by the classic special-question flags, so
        // they stay populated for knockout tournaments.
        for (const bet of [...valuesOf(winnerBets), ...valuesOf(runnerUpBets)]) {
            const teamId = bet.answer?.id
            if (teamId == null) continue
            add(bet.user_tournament_id, liveSpecialAdvancePoints(teamId, liveGames, bracket))
        }

        return added
    },
)
