import { fetchGroups } from '../api/groups'
import { AppDispatch, GetRootState } from '../_helpers/store'
import { CurrentTournament, Groups } from '../_selectors'
import groups from '../_reducers/groups'
import { generateInitCollectionAction } from './utils'
import { CollectionName } from '../types/dataFetcher'

function fetchAndStoreGroups() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournament = CurrentTournament(getState())
        const { competitionId, id: tournamentId } = tournament;
        const data = await fetchGroups(tournamentId)
        dispatch(groups.actions.set({competitionId, groups: data}))
    }
}

const initGroups = generateInitCollectionAction({
    collectionName: CollectionName.Groups,
    selector: Groups,
    fetchAction: fetchAndStoreGroups,
})

export { fetchAndStoreGroups, initGroups }
