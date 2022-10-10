import { AppDispatch } from '../_helpers/store'
import { getCompetitions } from '../api/competitions'
import competitions from '../_reducers/competitions'

function fetchAndStoreCompetitions() {
    return async (dispatch: AppDispatch) => {
        const competitionsById = await getCompetitions()
        dispatch(competitions.actions.set(competitionsById))
    }
}

export { fetchAndStoreCompetitions }
