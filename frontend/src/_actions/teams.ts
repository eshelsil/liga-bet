import { fetchTeams } from '../api/teams'
import { AppDispatch, GetRootState } from '../_helpers/store'
import teamsSlice from '../_reducers/teams'
import { TournamentIdSelector } from '../_selectors/base'

function fetchAndStoreTeams() {
    return (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = TournamentIdSelector(getState())
        return fetchTeams(tournamentId).then((data) =>
            dispatch(teamsSlice.actions.set(data))
        )
    }
}

export { fetchAndStoreTeams }
