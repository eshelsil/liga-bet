import { importUtlBets } from '../api/bets'
import { AppDispatch, GetRootState } from '../_helpers/store'
import { CurrentTournamentId, IsConfirmedUtl } from '../_selectors'
import { fetchAndStorePrimalBets, fetchMyGameBets } from './bets'


function importBetsFromTournament(from: number) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = CurrentTournamentId(getState())
        const bets = await importUtlBets(tournamentId, from)
        const isConfirmed = IsConfirmedUtl(getState())
        if (isConfirmed) {
            dispatch(fetchMyGameBets())
            dispatch(fetchAndStorePrimalBets())
        }
    }
}


export {
    importBetsFromTournament,
}
