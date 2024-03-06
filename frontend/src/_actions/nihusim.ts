import { keyBy } from 'lodash'
import { CollectionName } from '../types/dataFetcher'
import { AppDispatch, GetRootState } from '../_helpers/store'
import nihusGrantsReducer from '../_reducers/nihusGrants'
import { CurrentTournamentId, IsTournamentOngoing, NihusGrants } from '../_selectors'
import { generateInitCollectionAction } from './utils'
import { SendNihusParams, fetchNihusGrants, fetchNihusim, postSeenNihus, postSeenNihusGrant, sendNihus } from '@/api/nihusim'
import nihusimSlice from '@/_reducers/nihusim'


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

function markSeenNihus(nihusId: number) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = CurrentTournamentId(getState())
        const nihus = await postSeenNihus(tournamentId, nihusId)
        dispatch(nihusimSlice.actions.updateOne({
            tournamentId,
            nihus,
        }))
    }
}

function fetchAndStoreNihusim() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = CurrentTournamentId(getState())
        const nihusim = await fetchNihusim(tournamentId)
        const nihusimById = keyBy(nihusim, 'id')
        dispatch(nihusimSlice.actions.updateMany({
            tournamentId,
            nihusim: nihusimById,
        }))
    }
}

function sendAndStoreNihus(params: Omit<SendNihusParams, 'tournamentId'>) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = CurrentTournamentId(getState())
        const nihus = await sendNihus({...params, tournamentId,} )
        dispatch(nihusimSlice.actions.updateOne({
            tournamentId,
            nihus,
        }))
    }
}

const initNihusGrants = generateInitCollectionAction({
    collectionName: CollectionName.NihusGrants,
    selector: NihusGrants,
    fetchAction: fetchAndStoreNihusGrants,
    shouldFetchSelector: IsTournamentOngoing,
})


export { fetchAndStoreNihusGrants, initNihusGrants, markSeenNihusGrant, fetchAndStoreNihusim, markSeenNihus, sendAndStoreNihus }
