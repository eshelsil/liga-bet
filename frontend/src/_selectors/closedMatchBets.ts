import { groupBy } from 'lodash'
import { createSelector } from 'reselect'
import { MatchWithBets } from '../types'
import { getMatchBetValue, isGameStarted } from '../utils'
import { LiveGameBetsWithScoreByGameId } from './logic'
import { DoneGameBetsByGameId, MatchesWithTeams } from './modelRelations'


export const ClosedMatchBetsSelector = createSelector(
    DoneGameBetsByGameId,
    MatchesWithTeams,
    LiveGameBetsWithScoreByGameId,
    (doneGameBetsByGameId, matches, liveGameBetsByUtlId) => {
        const done_matches: MatchWithBets[] = []
        const live_matches: MatchWithBets[] = []
        for (const match of Object.values(matches)) {
            if (match.is_done) {
                const bets = doneGameBetsByGameId[match.id] ?? []
                const betsByValue = groupBy(bets, (bet) => getMatchBetValue(bet, match.isTwoLeggedTie))
                const matchWithBetsByValue = {
                    ...match,
                    betsByValue,
                }
                done_matches.push(matchWithBetsByValue)
            } else if (isGameStarted(match)) {
                const bets = liveGameBetsByUtlId[match.id] ?? []
                const betsByValue = groupBy(bets, (bet) => getMatchBetValue(bet, match.isTwoLeggedTie))
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
