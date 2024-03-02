import { NihusGrant } from '../types'
import { sendApiRequest } from './common/apiRequest'



export const postSeenNihusGrant = async (
    tournamentId: number,
    grantId: number,
): Promise<NihusGrant> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/notifications/seen`,
        type: 'POST',
        hideErrorToastr: true,
        data: {notificationId: grantId},
    })
}

export const fetchNihusGrants = async (
    tournamentId: number
): Promise<NihusGrant[]> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/notifications`,
        hideErrorToastr: true,
    })
}

export const fetchNihusim = async (
    tournamentId: number
): Promise<NihusGrant[]> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/nihusim`,
        hideErrorToastr: true,
    })
}
export const fetchMySentNihusim = async (
    tournamentId: number
): Promise<NihusGrant[]> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/nihusim/sent`,
    })
}

export const postSeenNihus = async (
    tournamentId: number,
    nihusId: number,
): Promise<NihusGrant> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/nihusim/seen`,
        type: 'POST',
        hideErrorToastr: true,
        data: {nihusId},
    })
}

export const sendNihus = async ({
    tournamentId,
    gameId,
    targetUtlId,
    text,
    gif,
}: {
    tournamentId: number
    gameId: number
    targetUtlId: number
    text: string
    gif: string
}): Promise<NihusGrant> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/nihusim`,
        type: 'POST',
        data: {
            gameId,
            targetUtlId,
            text,
            gif,
        },
    })
}