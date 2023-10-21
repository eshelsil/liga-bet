import { fetchLeaderboards, fetchLeaderboardVersions } from '../api/leaderboard'
import { CollectionName } from '../types/dataFetcher'
import { AppDispatch, GetRootState } from '../_helpers/store'
import leaderboardVersionsReducer from '../_reducers/leaderboardVersions'
import leaderboardRowsReducer from '../_reducers/leaderboardRows'
import { CurrentLeaderboardsFetcher, CurrentTournamentId, IsTournamentStarted, LeaderboardsFetcherState, LeaderboardVersionsState, LeaderboardVersionsWithGames, TournamentIdSelector } from '../_selectors'
import { generateInitCollectionAction } from './utils'
import leaderboardsFetcher, { LATEST_VERSION_FETCH_ID } from '../_reducers/leaderboardsFetcher'
import { generateEmptyFetcherSlice, getLatestScoreboard, keysOf } from '../utils'
import { isEmpty, without } from 'lodash'


function fetchAndStoreLeaderboards(ids: number[], tournamentId: number) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const isFetchingLatestVersion = ids.length === 0
        const leaderboardRowsByVersionId = await fetchLeaderboards(tournamentId, ids)
        if (isFetchingLatestVersion){
            const latestVersionId = keysOf(leaderboardRowsByVersionId)[0]
            dispatch(leaderboardVersionsReducer.actions.createPlaceholderVersionIfMissing({tournamentId, id: latestVersionId}))
        }
        dispatch(leaderboardRowsReducer.actions.updateMany({tournamentId, leaderboardRowsByVersionId}))
    }
}

function fetchAndStoreLeaderboardVersions() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = TournamentIdSelector(getState())
        const leaderboardVersions = await fetchLeaderboardVersions(tournamentId)
        dispatch(leaderboardVersionsReducer.actions.set({tournamentId, leaderboardVersions}))
    }
}

const initLeaderboardVersions = generateInitCollectionAction({
    collectionName: CollectionName.LeaderboardVersions,
    selector: LeaderboardVersionsWithGames,
    fetchAction: fetchAndStoreLeaderboardVersions,
    shouldFetchSelector: IsTournamentStarted,
})


function fetchLeaderboardsThunk(idsToFetch: number[], targetTournamentId?: number){
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = targetTournamentId ?? CurrentTournamentId(getState())
        const { fetched, currentlyFetching } = targetTournamentId
            ? (LeaderboardsFetcherState(getState())[tournamentId] ?? generateEmptyFetcherSlice())
            : CurrentLeaderboardsFetcher(getState())
        const shouldFetchLatest = idsToFetch.length === 0
        let ids = shouldFetchLatest ? [LATEST_VERSION_FETCH_ID] : idsToFetch;
        if (shouldFetchLatest){
            const leaderboardVersionsByTournament = LeaderboardVersionsState(getState())
            const leaderboardRowsByTournament = LeaderboardVersionsState(getState())
            const leaderboardVersions = leaderboardVersionsByTournament[tournamentId] || []
            const leaderboardRowsByVersionId = leaderboardRowsByTournament[tournamentId] || {}
            const latestVersion = getLatestScoreboard(leaderboardVersions, leaderboardRowsByVersionId)
            if (!isEmpty(latestVersion)){
                return
            }
        }
        ids = without(ids, ...[...currentlyFetching, ...fetched])
        if (ids.length === 0){
            return
        }

        const fetchParams = {tournamentId, ids}
        dispatch(leaderboardsFetcher.actions.fetch(fetchParams))
        dispatch(fetchAndStoreLeaderboards( (shouldFetchLatest ? [] : ids), tournamentId))
            .then(() => dispatch(leaderboardsFetcher.actions.resolve(fetchParams)))
            .catch(
                (error) => dispatch(
                    leaderboardsFetcher.actions.reject({
                        ...fetchParams,
                        error: error?.responseJSON?.message ?? JSON.stringify(error)
                    })
                )
            )
    }
}


export {
    fetchAndStoreLeaderboardVersions,
    initLeaderboardVersions,
    fetchLeaderboardsThunk,
}
