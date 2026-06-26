import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { BracketData, BracketScoreConfig, BracketSpecialBets, SpecialQuestionType } from '../types'
import { BracketScoresConfigSelector, CurrentBracketGames, IsTournamentStarted, OpenQuestionBetsSelector } from '../_selectors'
import { useAppDispatch } from '../_helpers/store'
import { sendQuestionBetsAndStore } from '../_actions/bets'
import { deriveBracketConfig } from '../utils'

/**
 * Single data-source seam for the whole bracket UI. Reads the real bracket
 * (GET /api/tournaments/{id}/bracket, stored in redux by `fetchAndStoreBracket`)
 * and derives the structural config from the flat list.
 */
export function useBracket(): BracketData {
    const games = useSelector(CurrentBracketGames)
    return { config: deriveBracketConfig(games), games }
}

/**
 * Bracket scoring (contract F). Prefers the tournament's real `scores.bracket`
 * config (so admin overrides display), falling back to the mock defaults while
 * the backend isn't serving it.
 */
export function useBracketScores(): BracketScoreConfig {
    const fromConfig = useSelector(BracketScoresConfigSelector)
    return fromConfig ?? {qualifier: {}, result: {}, specialAdvance: {}}
}

/**
 * The user's Winner & Runner-Up picks for this bracket (contracts E/G). Resolves
 * the two SpecialBet ids by type from the tournament's special questions and the
 * user's current answers; `locked` once the tournament has started.
 */
export function useBracketSpecialBets(): BracketSpecialBets {
    const { questionsWithBet } = useSelector(OpenQuestionBetsSelector)
    const locked = useSelector(IsTournamentStarted)
    const byType = (type: SpecialQuestionType) =>
        questionsWithBet.find((q) => q.type === type)
    const winnerQ = byType(SpecialQuestionType.Winner)
    const runnerUpQ = byType(SpecialQuestionType.RunnerUp)
    return {
        winner: {
            betId: winnerQ?.id ?? null,
            teamId: winnerQ?.bet?.answer?.id ?? null,
            removedReason: null, // server-side removals surface via notifications (future)
        },
        runnerUp: {
            betId: runnerUpQ?.id ?? null,
            teamId: runnerUpQ?.bet?.answer?.id ?? null,
            removedReason: null,
        },
        locked,
    }
}

/**
 * Submit BOTH the Winner and Runner-Up picks as SpecialBets (contract E:
 * `{type:SpecialBet, data:{type_id, answer}}`), resolving ids by type (contract G).
 * Sent as a SINGLE request so the backend validates the pair against each other — swapping
 * the two picks must not collide with the stale stored value. Called once, when the user
 * confirms the final winner.
 */
export function useSubmitWinnerAndRunnerUp() {
    const dispatch = useAppDispatch()
    return useCallback(
        async (
            winnerBetId: number | null,
            winnerTeamId: number,
            runnerUpBetId: number | null,
            runnerUpTeamId: number,
        ): Promise<void> => {
            const answers = [
                winnerBetId != null ? { betId: winnerBetId, teamId: winnerTeamId } : null,
                runnerUpBetId != null ? { betId: runnerUpBetId, teamId: runnerUpTeamId } : null,
            ].filter((a): a is { betId: number; teamId: number } => a != null)
            await dispatch(sendQuestionBetsAndStore(answers))
        },
        [dispatch],
    )
}
