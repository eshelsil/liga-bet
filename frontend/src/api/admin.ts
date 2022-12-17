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
