import { PlayerApiModel } from '../types'
import { sendApiRequest } from './common/apiRequest'

type PlayersApiResult = PlayerApiModel[]

export const fetchPlayers = async (
    tournamentId: number
): Promise<PlayersApiResult> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/players`,
    })
}

export const fetchRelevantPlayers = async (
    tournamentId: number
): Promise<PlayersApiResult> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/players/relevant`,
    })
}
