import { groupBy } from 'lodash'
import { createSelector } from 'reselect'
import { MatchWithBets } from '../types'
import { getMatchBetValue, isGameStarted } from '../utils'
import { LiveGameBetsWithScoreByGameId } from './logic'
import { DoneGameBetsByGameId, MatchesWithTeams } from './modelRelations'
import { IsCurrentTournamentIncludesBetOnResult } from './base'


export const ClosedMatchBetsSelector = createSelector(
    DoneGameBetsByGameId,
    MatchesWithTeams,
    LiveGameBetsWithScoreByGameId,
    IsCurrentTournamentIncludesBetOnResult,
    (doneGameBetsByGameId, matches, liveGameBetsByUtlId, isResultBetOn) => {
        const done_matches: MatchWithBets[] = []
        const live_matches: MatchWithBets[] = []
        for (const match of Object.values(matches)) {
            if (match.is_done) {
                const bets = doneGameBetsByGameId[match.id] ?? []
                const betsByValue = groupBy(bets, (bet) => getMatchBetValue({ matchBet: bet, isResultBetOn,isTwoLegsTie: match.isTwoLeggedTie }))
                const matchWithBetsByValue = {
                    ...match,
                    betsByValue,
                }
                done_matches.push(matchWithBetsByValue)
            } else if (isGameStarted(match)) {
                const bets = liveGameBetsByUtlId[match.id] ?? []
                const betsByValue = groupBy(bets, (bet) => getMatchBetValue({ matchBet: bet, isResultBetOn, isTwoLegsTie: match.isTwoLeggedTie }))
                const matchWithBetsByValue = {
                    ...match,
                    betsByValue,
                }
                live_matches.push(matchWithBetsByValue)
            }
        }
        return {
            done_matches,
            live_matches,
        }
    }
)

// Same live/done split, but only the knockout ties — used by the knockout-bracket
// "Games" tab, where group-stage games aren't the user's to bet on (see notifications).
export const KnockoutClosedMatchBetsSelector = createSelector(
    ClosedMatchBetsSelector,
    ({ done_matches, live_matches }) => ({
        done_matches: done_matches.filter((m) => m.is_knockout),
        live_matches: live_matches.filter((m) => m.is_knockout),
    })
)
