import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Dictionary, union, without } from 'lodash'
import { FetchGameBetsParams, GameBetsFetcher } from '../types/dataFetcher'
import { generateEmptyGameBetFetcher } from '../utils'


type State = Dictionary<GameBetsFetcher>

type ActionPayload = FetchGameBetsParams

interface RejectPayload extends ActionPayload {
    error: string
}

const gameBetsFetcher = createSlice({
    name: 'gameBetsFetcher',
    initialState: {} as State,
    reducers: {
        fetch: (state, action: PayloadAction<ActionPayload>) => {
            const { tournamentId, ids, type } = action.payload
            state[tournamentId] = state[tournamentId] ?? generateEmptyGameBetFetcher();
            const slice = state[tournamentId][type]
            slice.currentlyFetching = union(slice.currentlyFetching, ids)
            slice.error = null
        },
        resolve: (state, action: PayloadAction<ActionPayload>) => {
            const { tournamentId, ids, type } = action.payload
            const slice = state[tournamentId][type]
            slice.currentlyFetching = without(slice.currentlyFetching, ...ids)
            slice.fetched = union(slice.fetched, ids)
        },
        reject: (state, action: PayloadAction<RejectPayload>) => {
            const { tournamentId, ids, type, error } = action.payload
            const slice = state[tournamentId][type]
            slice.error = error
            slice.currentlyFetching = without(slice.currentlyFetching, ...ids)
        },
    },
})

export default gameBetsFetcher
