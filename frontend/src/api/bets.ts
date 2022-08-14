import { BetApiModel, BetType } from "../types";
import { sendApiRequest } from "./common/apiRequest";

type BetsApiResult = Record<number, BetApiModel>

export const fetchBets = async (tournamentId: number): Promise<BetsApiResult> => {
    return await (window as any).$.ajax({
        type: 'GET',
        url: `/api/tournaments/${tournamentId}/bets`,
        contentType: 'application/json',
        dataType: 'json',
    });
};

// export const fetchGroupRankBets = async (tournamentId: number): Promise<BetsApiResult> => {
//     return await (window as any).$.ajax({
//         type: 'GET',
//         url: `/api/tournaments/${tournamentId}/bets/group`,
//         contentType: 'application/json',
//         dataType: 'json',
//     });
// };

export const fetchMyBets = async (tournamentId: number): Promise<BetsApiResult> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/bets`
    });
};

export const fetchClosedMatchBets = async (tournamentId: number): Promise<BetsApiResult> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/bets/closed-games`
    });
};

// export const fetchMatchBets = async (tournamentId: number): Promise<BetsApiResult> => {
//     return await (window as any).$.ajax({
//         type: 'GET',
//         url: `/api/tournaments/${tournamentId}/bets/open-games`,
//         contentType: 'application/json',
//         dataType: 'json',
//     });
// };

export const sendBet = async (
    tournamentId: number,
    betType: BetType,
    params: object
): Promise<BetsApiResult> =>{
    const {bets = {}} = await sendApiRequest({
        type: 'POST',
        url: `/api/tournaments/${tournamentId}/bets`,
        data: {
            bets: [{
                type: betType,
                data: params,
            }]
        },
    })
    return bets; 
};