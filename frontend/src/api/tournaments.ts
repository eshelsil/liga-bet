import { Tournament, TournamentConfig, TournamentScoreConfig, TournamentStatus } from '../types'
import { sendApiRequest } from './common/apiRequest'

export const createTournament = async ({
    competition,
    name,
}: {
    competition: number
    name: string
}): Promise<Tournament> => {
    return await sendApiRequest({
        url: '/api/tournaments',
        type: 'POST',
        data: { competition, name },
    })
}

export const getTournamentsOwnedByUser = async (): Promise<Tournament[]> => {
    return await sendApiRequest({
        url: '/api/user/tournaments',
    })
}

export const updateTournamentScoresConfig = async (tournamentId: number, config: TournamentScoreConfig): Promise<Tournament> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/scores`,
        type: 'PUT',
        data: config
    })
}

export const updateTournamentPrizesConfig = async (tournamentId: number, prizes: TournamentConfig['prizes']): Promise<Tournament> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/prizes`,
        type: 'PUT',
    })
}

export const updateTournamentStatus = async (tournamentId: number, status: TournamentStatus): Promise<Tournament> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/status`,
        type: 'PUT',
        data: {status}
    })
}
