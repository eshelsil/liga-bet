import { fetchBracket } from '../api/bracket'
import { AppDispatch, GetRootState } from '../_helpers/store'
import bracketSlice from '../_reducers/bracket'
import { TournamentIdSelector } from '../_selectors'

export function fetchAndStoreBracket() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = TournamentIdSelector(getState())
        const games = await fetchBracket(tournamentId)
        dispatch(bracketSlice.actions.set({ tournamentId, games }))
    }
}
