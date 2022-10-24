import { keyBy } from 'lodash'
import { fetchMatches } from '../api/matches'
import { CollectionName } from '../types/dataFetcher'
import { AppDispatch, GetRootState } from '../_helpers/store'
import matches from '../_reducers/matches'
import { CurrentTournament, Games } from '../_selectors/base'
import { generateInitCollectionAction } from './utils'

function fetchAndStoreMatches() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournament = CurrentTournament(getState())
        const { competitionId, id: tournamentId } = tournament;
        const games = await fetchMatches(tournamentId)
        dispatch(matches.actions.updateMany({
            competitionId,
            games: keyBy(games, 'id'),
        }))
    }
}

const initGames = generateInitCollectionAction({
    collectionName: CollectionName.Games,
    selector: Games,
    fetchAction: fetchAndStoreMatches,
})


export { fetchAndStoreMatches, initGames }
