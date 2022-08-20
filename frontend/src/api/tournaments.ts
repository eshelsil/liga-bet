import { Tournament } from "../types";
import { sendApiRequest } from "./common/apiRequest";



export const createTournament = async ({
    competition,
    name,
}: {
    competition: number,
    name: string,
}): Promise<Tournament> => {
    return await sendApiRequest({
        url: '/api/tournaments',
        type: 'POST',
        data: {competition, name},
    });
}

export const getTournamentsOwnedByUser = async (): Promise<Tournament[]> => {
    return await sendApiRequest({
        url: '/api/user/tournaments',
    });
}