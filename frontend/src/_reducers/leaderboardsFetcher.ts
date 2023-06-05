import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Dictionary, union, without } from 'lodash'
import { FetchGameBetsParams, FetchLeaderboardsParams, GameBetsFetcher, LeaderboardsFetcher } from '../types/dataFetcher'
import { generateEmptyGameBetFetcher } from '../utils'


type LeaderboardsFetcherState = Record<number, LeaderboardsFetcher>

type ActionPayload = FetchLeaderboardsParams

interface RejectPayload extends ActionPayload {
    error: string
}

function generateEmptyFetcher(): LeaderboardsFetcher{
    return {
        fetched: [],
        currentlyFetching: [],
        error: null,
    }
}

export const LATEST_VERSION_FETCH_ID = -1

const leaderboardsFetcher = createSlice({
    name: 'leaderboardsFetcher',
    initialState: {} as LeaderboardsFetcherState,
    reducers: {
        markUnfetched: (state, action: PayloadAction<ActionPayload>) => {
            const { tournamentId, ids } = action.payload
            state[tournamentId] = state[tournamentId] ?? generateEmptyFetcher();
            const slice = state[tournamentId]
            slice.fetched = without(slice.fetched, ...ids)
        },
        fetch: (state, action: PayloadAction<ActionPayload>) => {
            const { tournamentId, ids } = action.payload
            state[tournamentId] = state[tournamentId] ?? generateEmptyFetcher();
            const slice = state[tournamentId]
            slice.currentlyFetching = union(slice.currentlyFetching, ids)
            slice.error = null
        },
        resolve: (state, action: PayloadAction<ActionPayload>) => {
            const { tournamentId, ids } = action.payload
            const slice = state[tournamentId]
            slice.currentlyFetching = without(slice.currentlyFetching, ...ids)
            slice.fetched = union(slice.fetched, ids)
        },
        reject: (state, action: PayloadAction<RejectPayload>) => {
            const { tournamentId, ids, error } = action.payload
            const slice = state[tournamentId]
            slice.error = error
            slice.currentlyFetching = without(slice.currentlyFetching, ...ids)
        },
    },
})

export default leaderboardsFetcher
