import { LeaderboardVersionApiModel } from '../types'
import { sendApiRequest } from './common/apiRequest'

type LeaderboardApiResult = LeaderboardVersionApiModel[]


export const fetchLeaderboard = async (
    tournamentId: number
): Promise<LeaderboardApiResult> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/leaderboards-v2`,
    })
}
