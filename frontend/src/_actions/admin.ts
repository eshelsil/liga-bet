import { AppDispatch } from '../_helpers/store'
import { getAllTournamentsDetailed } from '../api/tournaments'
import allTournamentsSlice from '../_reducers/admin/allTournaments'
import { keyBy } from 'lodash'


function fetchAndStoreAllTournamentsDetails() {
    return async (dispatch: AppDispatch) => {
        const detailedTournaments = await getAllTournamentsDetailed()
        dispatch(allTournamentsSlice.actions.set(keyBy(detailedTournaments, 'id')))
    }
}

export {
    fetchAndStoreAllTournamentsDetails,
}
