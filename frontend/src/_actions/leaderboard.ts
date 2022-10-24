import { fetchLeaderboard } from '../api/leaderboard'
import { CollectionName } from '../types/dataFetcher'
import { AppDispatch, GetRootState } from '../_helpers/store'
import leaderboard from '../_reducers/leaderboard'
import { IsTournamentStarted, LeaderboardVersions, TournamentIdSelector } from '../_selectors'
import { generateInitCollectionAction } from './utils'

function fetchAndStoreLeaderboard() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = TournamentIdSelector(getState())
        const leaderboardVersions = await fetchLeaderboard(tournamentId)
        dispatch(leaderboard.actions.setRows({tournamentId, leaderboardVersions}))
    }
}

const initLeaderboard = generateInitCollectionAction({
    collectionName: CollectionName.Leaderboard,
    selector: LeaderboardVersions,
    fetchAction: fetchAndStoreLeaderboard,
    shouldFetchSelector: IsTournamentStarted,
})

export { fetchAndStoreLeaderboard, initLeaderboard }
