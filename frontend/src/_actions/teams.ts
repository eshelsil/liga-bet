import { keyBy } from 'lodash'
import { fetchTeams } from '../api/teams'
import { CollectionName } from '../types/dataFetcher'
import { AppDispatch, GetRootState } from '../_helpers/store'
import teamsSlice from '../_reducers/teams'
import { CurrentTournament, Teams } from '../_selectors'
import { generateInitCollectionAction } from './utils'

function fetchAndStoreTeams() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournament = CurrentTournament(getState())
        const {id: tournamentId, competitionId} = tournament
        const teams = await fetchTeams(tournamentId)
        dispatch(teamsSlice.actions.set({
            competitionId,
            teams: keyBy(teams, 'id'),
        }))
    }
}

const initTeams = generateInitCollectionAction({
    collectionName: CollectionName.Teams,
    selector: Teams,
    fetchAction: fetchAndStoreTeams,
})

export { fetchAndStoreTeams, initTeams }
