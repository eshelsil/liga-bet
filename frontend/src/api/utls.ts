import { UTL, UtlRole, UtlWithTournament } from "../types";
import { sendApiRequest } from "./common/apiRequest";


export const fetchUTLs = async (tournamentId: number): Promise<UTL[]> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/manage/utls`,
    });
}

export const removeUTL = async (tournamentId: number, utlId: number): Promise<null> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/manage/utls/${utlId}`,
        type: 'DELETE',
    });
}


export interface PayloadUpdateUTL {
    role: UtlRole
}

export const updateUTL = async (tournamentId: number, utlId: number, payload: PayloadUpdateUTL): Promise<UTL> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/manage/utls/${utlId}`,
        type: 'PUT',
        data: payload,
    });
}

export interface PayloadUpdateMyUTL {
    name: string,
}

export const updateMyUTL = async (tournamentId: number, payload: PayloadUpdateMyUTL): Promise<UtlWithTournament> => {
    return await sendApiRequest({
        url: `/api/user/utls/${tournamentId}`,
        type: 'PUT',
        data: payload,
    });
}