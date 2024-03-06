import { Nihus, NihusGrant } from '../types'
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
): Promise<Nihus[]> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/nihusim`,
        hideErrorToastr: true,
    })
}

export const fetchNihusGifs = async (
    tournamentId: number
): Promise<string[]> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/nihusim/gifs`,
    })
}

export const postSeenNihus = async (
    tournamentId: number,
    nihusId: number,
): Promise<Nihus> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/nihusim/seen`,
        type: 'POST',
        hideErrorToastr: true,
        data: {nihusId},
    })
}


export type SendNihusParams = {
    tournamentId: number
    gameId: number
    targetUtlId: number
    text: string
    gif: string
}
export const sendNihus = async ({
    tournamentId,
    gameId,
    targetUtlId,
    text,
    gif,
}: SendNihusParams): Promise<Nihus> => {
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