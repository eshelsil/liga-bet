import { createSelector } from 'reselect'
import { Competitions, MyUtls, OwnedTournaments, TournamentsWithMyUtl } from './base'

export const OwnedTournamentWithNoUtl = createSelector(
    OwnedTournaments,
    TournamentsWithMyUtl,
    (ownedTournaments, tournamentsWithUtl) => {
        for (const tournament of Object.values(ownedTournaments)) {
            if (!tournamentsWithUtl[tournament.id]) {
                return tournament
            }
        }
        return undefined
    }
)
export const CreateNewTournamentSelector = createSelector(
    Competitions,
    OwnedTournamentWithNoUtl,
    (competitionsById, tournamentWithNoUtl) => {
        return {
            competitionsById,
            tournamentWithNoUtl,
        }
    }
)
