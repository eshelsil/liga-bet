export enum CollectionName {
    Teams = 'teams',
    Games = 'games',
    Groups = 'groups',
    Players = 'players',
    SpecialQuestions = 'specialQuestions',
    Contestants = 'contestants',
    Leaderboard = 'leaderboard',
    LeaderboardVersions = 'leaderboardVersions',
    NihusGrants = 'nihusGrants',
    PrimalBets = 'primalBets',
    Goals = 'goalsData',
}

export interface CollectionFetcherData {
    name: CollectionName,
    initialized: boolean,
    loading: boolean,
    error: string,
}


export enum GameBetsFetchType {
    Users = 'users',
    Games = 'games',
}

export interface FetchLeaderboardsParams {
    ids: number[],
    tournamentId: number,
}

export interface LeaderboardsFetcher {
    fetched: number[],
    currentlyFetching: number[],
    error: string,
}

export interface FetchGameBetsParams {
    type: GameBetsFetchType,
    ids: number[],
    tournamentId: number,
}


export interface GameBetsFetcherSliceData {
    fetched: number[],
    currentlyFetching: number[],
    error: string,
}

export interface GameBetsFetcher {
    [GameBetsFetchType.Users]: GameBetsFetcherSliceData,
    [GameBetsFetchType.Games]: GameBetsFetcherSliceData,
}