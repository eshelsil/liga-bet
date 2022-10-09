import { BetApiModel, BetType, WinnerSide } from '../types'
import { sendApiRequest } from './common/apiRequest'

type BetsApiResult = Record<number, BetApiModel>

export const fetchMyBets = async (
    tournamentId: number
): Promise<BetsApiResult> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/bets`,
    })
}

export const fetchClosedMatchBets = async (
    tournamentId: number
): Promise<BetsApiResult> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/bets/games`,
    })
}

export const fetchPrimalBets = async (
    tournamentId: number
): Promise<BetsApiResult> => {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/bets/primal`,
    })
}

export interface MatchBetUpdatePayload {
    'result-home': number
    'result-away': number
    winner_side?: WinnerSide
}
export interface GroupRankBetUpdatePayload {
    value: number[]
}
export interface QuestionBetUpdatePayload {
    answer: number
}
export interface UpdateBetPayload {
    [BetType.Match]: MatchBetUpdatePayload
    [BetType.GroupsRank]: GroupRankBetUpdatePayload
    [BetType.Question]: QuestionBetUpdatePayload
}

export const sendBet = async (
    tournamentId: number,
    betType: BetType,
    type_id: number,
    params: UpdateBetPayload[keyof UpdateBetPayload]
): Promise<BetsApiResult> => {
    const { bets = {} } = await sendApiRequest({
        type: 'POST',
        url: `/api/tournaments/${tournamentId}/bets`,
        data: {
            bets: [
                {
                    type: betType,
                    data: {
                        ...params,
                        type_id,
                    },
                },
            ],
        },
    })
    return bets
}
