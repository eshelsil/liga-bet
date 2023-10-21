import { sendApiRequest } from './common/apiRequest'


export const sendInvitationForTournamentAdmin = async (
    email: string
): Promise<any> => {
    return await sendApiRequest({
        url: `/admin/grant-tournament-admin`,
        type: 'POST',
        data: {email},
    })
}

export const announceMvp = async (
    competitionId: number,
    playerId: number
): Promise<any> => {
    return await sendApiRequest({
        url: `/admin/announce-mvp`,
        type: 'POST',
        data: {mvp: playerId, competition: competitionId},
    })
}


export interface PlayerGameGoalsData {
    goals?: number
    assists?: number
}

export const setGameGoalData = async (
    gameId: number,
    players: Record<number, PlayerGameGoalsData>
): Promise<any> => {
    return await sendApiRequest({
        url: `/admin/set-game-goals-data`,
        type: 'POST',
        data: {gameId, players},
    })
}

export const updateScorersFromGoalsData = async (
    gameId: number,
): Promise<any> => {
    return await sendApiRequest({
        url: `/admin/update-scorers-from-goals-data`,
        type: 'POST',
        data: {gameId},
    })
}

export const updateSideTournamentGames = async (
    tournamentId: number,
    gameDay: string,
    sideTournamentId?: number,
): Promise<any> => {
    return await sendApiRequest({
        url: `/admin/update-side-tournament-games`,
        type: 'POST',
        data: {tournamentId, gameDay, sideTournamentId},
    })
}
