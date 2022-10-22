import { AppDispatch, GetRootState } from '../_helpers/store'
import contestantsSlice from '../_reducers/contestants'
import { fetchContestants } from '../api/contestants'
import { Contestants, TournamentIdSelector } from '../_selectors'
import { generateInitCollectionAction } from './utils'
import { CollectionName } from '../types/dataFetcher'

function fetchAndStoreContestants() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = TournamentIdSelector(getState())
        const utls = await fetchContestants(tournamentId)
        dispatch(contestantsSlice.actions.set({tournamentId, utls}))
    }
}

const initContestants = generateInitCollectionAction({
    collectionName: CollectionName.Contestants,
    selector: Contestants,
    fetchAction: fetchAndStoreContestants,
})

export { fetchAndStoreContestants, initContestants }
