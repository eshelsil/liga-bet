import { GameBetsFetcher, GameBetsFetcherSliceData, GameBetsFetchType } from '../types'

export function generateEmptyGameBetFetcherSlice(): GameBetsFetcherSliceData{
    return {
        fetched: [],
        currentlyFetching: [],
        error: null,
    }
}

export function generateEmptyGameBetFetcher(): GameBetsFetcher{
    return {
        [GameBetsFetchType.Users]: generateEmptyGameBetFetcherSlice(),
        [GameBetsFetchType.Games]: generateEmptyGameBetFetcherSlice(),
    }
}