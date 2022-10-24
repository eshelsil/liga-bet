import { Team } from '../types'
import { sendApiRequest } from './common/apiRequest'

type TeamsApiResult = Team[]

export const fetchTeams = async (
    tournamentId: number
): Promise<TeamsApiResult> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/teams`,
    })
}
