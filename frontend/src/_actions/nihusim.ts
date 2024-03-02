import { groupBy, keyBy } from 'lodash'
import { fetchGamesGoalsData, fetchMatches } from '../api/matches'
import { CollectionName } from '../types/dataFetcher'
import { AppDispatch, GetRootState } from '../_helpers/store'
import matches from '../_reducers/matches'
import nihusGrantsReducer from '../_reducers/nihusGrants'
import { CurrentTournament, CurrentTournamentId, GameGoalsDataSelector, Games, IsTournamentOngoing, IsTournamentStarted, NihusGrants } from '../_selectors'
import { generateInitCollectionAction } from './utils'
import { GameGoalsDataById, GameType } from '../types'
import { fetchNihusGrants, postSeenNihusGrant } from '@/api/nihusim'


function markSeenNihusGrant(grantId: number) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = CurrentTournamentId(getState())
        const nihusGrant = await postSeenNihusGrant(tournamentId, grantId)
        dispatch(nihusGrantsReducer.actions.updateOne({
            tournamentId,
            data: nihusGrant,
        }))
    }
}

function fetchAndStoreNihusGrants() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = CurrentTournamentId(getState())
        const nihusGrants = await fetchNihusGrants(tournamentId)
        const nihusGrantsById = keyBy(nihusGrants, 'id')
        dispatch(nihusGrantsReducer.actions.updateMany({
            tournamentId,
            data: nihusGrantsById,
        }))
    }
}

const initNihusGrants = generateInitCollectionAction({
    collectionName: CollectionName.NihusGrants,
    selector: NihusGrants,
    fetchAction: fetchAndStoreNihusGrants,
    shouldFetchSelector: IsTournamentOngoing,
})


export { fetchAndStoreNihusGrants, initNihusGrants, markSeenNihusGrant }
