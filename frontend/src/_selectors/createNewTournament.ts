import { createSelector } from 'reselect'
import { OpenCompetitions, OwnedTournaments, TournamentsWithMyUtl } from './base'
import { pickBy } from 'lodash'
import { isTournamentLive } from '../utils'

export const OwnedTournamentWithNoUtl = createSelector(
    OwnedTournaments,
    TournamentsWithMyUtl,
    (ownedTournaments, tournamentsWithUtl) => {
        const relevantOwnedTournaments = pickBy(ownedTournaments, t => isTournamentLive(t))
        for (const tournament of Object.values(relevantOwnedTournaments)) {
            if (!tournamentsWithUtl[tournament.id]) {
                return tournament
            }
        }
        return undefined
    }
)
export const CreateNewTournamentSelector = createSelector(
    OpenCompetitions,
    OwnedTournamentWithNoUtl,
    (competitionsById, tournamentWithNoUtl) => {
        return {
            competitionsById,
            tournamentWithNoUtl,
        }
    }
)
