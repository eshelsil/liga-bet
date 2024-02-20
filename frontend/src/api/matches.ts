import { GameGoalsData, MatchApiModel } from '../types'
import { sendApiRequest } from './common/apiRequest'



type MatchApiResult = MatchApiModel[]

export const fetchMatches = async (
    tournamentId: number
): Promise<MatchApiResult> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/games`,
    })
}

export const fetchGamesGoalsData = async (
    tournamentId: number
): Promise<GameGoalsData[]> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/goals`,
    })
}
