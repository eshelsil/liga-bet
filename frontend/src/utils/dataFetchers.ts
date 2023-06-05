import { CollectionName, GameBetsFetcher, GameBetsFetcherSliceData, GameBetsFetchType } from '../types'

export function generateEmptyFetcherSlice(): GameBetsFetcherSliceData{
    return {
        fetched: [],
        currentlyFetching: [],
        error: null,
    }
}

export function generateEmptyGameBetFetcher(): GameBetsFetcher{
    return {
        [GameBetsFetchType.Users]: generateEmptyFetcherSlice(),
        [GameBetsFetchType.Games]: generateEmptyFetcherSlice(),
    }
}

export const initialDataCollections = [
    CollectionName.Games,
    CollectionName.Groups,
    CollectionName.SpecialQuestions,
    CollectionName.Teams,
    CollectionName.PrimalBets,
    CollectionName.Players,
    CollectionName.Contestants,
]