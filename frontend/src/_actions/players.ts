import { keyBy } from 'lodash'
import { fetchPlayers } from '../api/players'
import { CollectionName } from '../types/dataFetcher'
import { AppDispatch, GetRootState } from '../_helpers/store'
import playersSlice from '../_reducers/players'
import { CurrentTournament, Players } from '../_selectors'
import { generateInitCollectionAction } from './utils'

function fetchAndStorePlayers() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournament = CurrentTournament(getState())
        const {id: tournamentId, competitionId} = tournament;
        const players = await fetchPlayers(tournamentId)
        const playersById = keyBy(players, 'id')
        dispatch(playersSlice.actions.setMany({competitionId, players: playersById}))
    }
}

const initPlayers = generateInitCollectionAction({
    collectionName: CollectionName.Players,
    selector: Players,
    fetchAction: fetchAndStorePlayers,
})

export { fetchAndStorePlayers, initPlayers }
