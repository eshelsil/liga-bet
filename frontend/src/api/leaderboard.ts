import { LeaderboardVersionApiModel, ScoreboardRow } from '../types'
import { sendApiRequest } from './common/apiRequest'

type LeaderboardVersionsApiResult = LeaderboardVersionApiModel[]
type LeaderboardsApiResult = Record<number, ScoreboardRow[]>


export const fetchLeaderboards = async (
    tournamentId: number,
    ids: number[],
): Promise<LeaderboardsApiResult> => {
    const queryString = `ids=${encodeURIComponent(JSON.stringify(ids))}`
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/leaderboards?${queryString}`,
    })
}

export const fetchLeaderboardVersions = async (
    tournamentId: number
): Promise<LeaderboardVersionsApiResult> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/leaderboardVersions`,
    })
}
