import { UTLsById } from "../types";
import { sendApiRequest } from "./common/apiRequest";


export const fetchContestants = async (tournamentId: number): Promise<UTLsById> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/contestants`,
    });
}