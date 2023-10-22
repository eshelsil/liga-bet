import { groupBy, mapValues, pickBy } from 'lodash'
import { createSelector } from 'reselect'
import { MatchBetWithRelations } from '../../types'
import { getSideTournamentId, isGameLive, valuesOf } from '../../utils'
import { MatchBets, Contestants, CurrentTournament, CurrentSideTournamentId } from '../base'
import { MatchesWithTeams } from './matches'

export const MatchBetsWithUserNames = createSelector(
    MatchBets,
    Contestants,
    (bets, users) => {
        return mapValues(bets, (bet) => ({
            ...bet,
            utlName: users[bet.user_tournament_id]?.name,
        }))
    }
)

export const MatchBetsLinked = createSelector(
    MatchBetsWithUserNames,
    MatchesWithTeams,
    (matchBets, matches) => {
        const betsWithRelatedMatch = mapValues(
            matchBets,
            (bet): MatchBetWithRelations => ({
                ...bet,
                relatedMatch: matches[bet.type_id],
            })
        )
        return pickBy(betsWithRelatedMatch, (bet) => bet.relatedMatch)
    }
)

export const MatchBetsByMatchId = createSelector(MatchBetsLinked, (bets) => {
    return groupBy(Object.values(bets), 'type_id')
})

export const MatchBetsByUserId = createSelector(MatchBetsLinked, (bets) => {
    return groupBy(valuesOf(bets), 'user_tournament_id')
})

export const LiveGameBets = createSelector(
    MatchBetsLinked,
    CurrentTournament,
    CurrentSideTournamentId,
    (matchBets, currentTournament, sideTournamentId) => {
        return pickBy(matchBets, 
            bet => (
                isGameLive(bet.relatedMatch) && (getSideTournamentId(bet, currentTournament) === sideTournamentId)
            )
        )
    }
)

export const LiveGameBetsIncludingAll = createSelector(
    MatchBetsLinked,
    (matchBets) => {
        return pickBy(matchBets, 
            bet => isGameLive(bet.relatedMatch)
        )
    }
)

export const DoneGameBets = createSelector(
    MatchBetsLinked,
    (matchBets) => {
        return pickBy(matchBets, (bet => bet.relatedMatch.is_done))
    }
)

export const DoneGameBetsByGameId = createSelector(
    DoneGameBets,
    (doneGameBets) => {
        return groupBy(valuesOf(doneGameBets), bet => bet.relatedMatch.id)
    }
)