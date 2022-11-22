import { groupBy, keyBy } from 'lodash'
import { fetchGamesGoalsData, fetchMatches } from '../api/matches'
import { CollectionName } from '../types/dataFetcher'
import { AppDispatch, GetRootState } from '../_helpers/store'
import matches from '../_reducers/matches'
import goalsDataReducer from '../_reducers/goalsData'
import { CurrentTournament, GameGoalsDataSelector, Games } from '../_selectors'
import { generateInitCollectionAction } from './utils'
import { GameGoalsDataById } from '../types'

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

function fetchAndStoreGoalsData() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournament = CurrentTournament(getState())
        const { competitionId, id: tournamentId } = tournament;
        const goalsData = await fetchGamesGoalsData(tournamentId)
        dispatch(goalsDataReducer.actions.updateMany({
            competitionId,
            goalsData: groupBy(goalsData, 'gameId') as GameGoalsDataById,
        }))
    }
}

const initGames = generateInitCollectionAction({
    collectionName: CollectionName.Games,
    selector: Games,
    fetchAction: fetchAndStoreMatches,
})



const initGoalsData = generateInitCollectionAction({
    collectionName: CollectionName.Goals,
    selector: GameGoalsDataSelector,
    fetchAction: fetchAndStoreGoalsData,
})


export { fetchAndStoreMatches, fetchAndStoreGoalsData, initGames, initGoalsData }
