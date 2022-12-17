import { createSelector } from 'reselect'
import { CurrentTournamentId } from '../base';

const OUR_TOURNAMENT_ID = 1

export const IsOurTournament = createSelector(
    CurrentTournamentId,
    (tournamentId) => {
        return tournamentId === OUR_TOURNAMENT_ID
    }
)
