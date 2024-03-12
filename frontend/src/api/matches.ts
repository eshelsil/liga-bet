import { GameGoalsData, MatchApiModel } from '../types'
import { sendApiRequest } from './common/apiRequest'



type MatchApiResult = MatchApiModel[]

let version: string = null;
export const fetchMatches = async (
    tournamentId: number
): Promise<MatchApiResult> => {
    const { data: games, headers } = await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/games`,
        includeResponseHeaders: ['X-App-Version'],
    })
    const newVersion = headers['X-App-Version']
    if (!version && newVersion) {
        version = newVersion
    } else if (newVersion && (version !== newVersion)) {
        window.location.reload();
    }
    return games;
}

export const fetchGamesGoalsData = async (
    tournamentId: number
): Promise<GameGoalsData[]> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/goals`,
    })
}
