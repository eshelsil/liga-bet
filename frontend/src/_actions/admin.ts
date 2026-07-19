import { AppDispatch } from '../_helpers/store'
import { getAllTournamentsDetailed } from '../api/tournaments'
import { updateCongratsAnimation } from '../api/admin'
import allTournamentsSlice from '../_reducers/admin/allTournaments'
import { keyBy } from 'lodash'
import { CongratsAnimationConfig } from '../types'


function fetchAndStoreAllTournamentsDetails() {
    return async (dispatch: AppDispatch) => {
        const detailedTournaments = await getAllTournamentsDetailed()
        dispatch(allTournamentsSlice.actions.set(keyBy(detailedTournaments, 'id')))
    }
}

function updateCongratsAnimationConfig(tournamentId: number, config: CongratsAnimationConfig) {
    return async (dispatch: AppDispatch) => {
        await updateCongratsAnimation(tournamentId, config)
        await dispatch(fetchAndStoreAllTournamentsDetails())
    }
}

export {
    fetchAndStoreAllTournamentsDetails,
    updateCongratsAnimationConfig,
}
