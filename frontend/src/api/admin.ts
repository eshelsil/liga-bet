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
