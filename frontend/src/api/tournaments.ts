import { TournamentSummaryData, NotificationsByTournamentId, Tournament, TournamentConfig, TournamentNotifications, TournamentPreferences, TournamentScoreConfig, TournamentStatus } from '../types'
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

export const getTournamentsName = async (code: string): Promise<string> => {
    return await sendApiRequest({
        url: `/api/tournament-name/${code}`,
        hideErrorToastr: true,
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
        data: {prizes}
    })
}

export const updateTournamentPreferences = async (tournamentId: number, prefs: Partial<TournamentPreferences>, hideErrorToastr?: boolean): Promise<TournamentPreferences> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/preferences`,
        type: 'PUT',
        hideErrorToastr,
        data: {...prefs}
    })
}

export const getTournamentNotifications = async (tournamentIds: number[], hideErrorToastr?: boolean): Promise<NotificationsByTournamentId> => {
    const queryString = `tournamentIds=${encodeURIComponent(JSON.stringify(tournamentIds))}`
    return await sendApiRequest({
        url: `/api/user/notifications?${queryString}`,
        hideErrorToastr,
    })
}


export const getAllTournamentsDetailed = async (): Promise<TournamentSummaryData[]> => {
    return await sendApiRequest({
        url: `/admin/running-tournaments-data`,
    })
}
