import { keyBy } from 'lodash'
import { fetchPlayers } from '../api/players'
import { AppDispatch, GetRootState } from '../_helpers/store'
import playersSlice from '../_reducers/players'
import { TournamentIdSelector } from '../_selectors'

function fetchAndStorePlayers() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = TournamentIdSelector(getState())
        const players = await fetchPlayers(tournamentId)
        const playersById = keyBy(players, 'id')
        dispatch(playersSlice.actions.setMany(playersById))
    }
}

export { fetchAndStorePlayers }
