import { LeaderboardVersionApiModel } from '../types'
import { sendApiRequest } from './common/apiRequest'

type LeaderboardApiResult = LeaderboardVersionApiModel[]


export const fetchLeaderboard = async (
    tournamentId: number
): Promise<LeaderboardApiResult> => {
    const useV2 = !!localStorage.getItem('LigaBet-useLeaderboardsV2')
    const url = useV2
        ? `/api/tournaments/${tournamentId}/leaderboards-v2`
        : `/api/tournaments/${tournamentId}/leaderboards`
    return await sendApiRequest({
        url,
    })
}
