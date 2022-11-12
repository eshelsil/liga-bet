import { groupBy, pickBy } from 'lodash'
import { createSelector } from 'reselect'
import { isUtlConfirmed } from '../../utils'
import { CurrentCompetitionId, CurrentTournamentUserId, MyUtls } from '../base'


export const BettableUTLsByCompetitionId = createSelector(
    MyUtls,
    (utls) => {
        const confirmedUtls = pickBy(utls, utl => isUtlConfirmed(utl))
        return groupBy(confirmedUtls, utl => utl.tournament.competitionId)
    }
)

export const MyBettableUTLs = createSelector(
    BettableUTLsByCompetitionId,
    CurrentCompetitionId,
    (utlsByCompId, competitionId) => utlsByCompId[competitionId]
)

export const MyOtherBettableUTLs = createSelector(
    MyBettableUTLs,
    CurrentTournamentUserId,
    (utls, utlId) => utls.filter(utl => utl.id !== utlId)
)

