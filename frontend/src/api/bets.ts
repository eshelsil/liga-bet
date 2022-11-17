import { BetApiModel, BetType, WinnerSide } from '../types'
import { FetchGameBetsParams, GameBetsFetchType } from '../types/dataFetcher'
import { sendApiRequest } from './common/apiRequest'

type BetsApiResult = Record<number, BetApiModel>


export const fetchMatchBets = async (
    { type, ids, tournamentId }: FetchGameBetsParams,
): Promise<BetsApiResult> => {
    let filterParam: string;
    if (type === GameBetsFetchType.Users) filterParam = 'utl_ids'
    if (type === GameBetsFetchType.Games) filterParam = 'game_ids'
    const queryString = `${filterParam}=${encodeURIComponent(JSON.stringify(ids))}`
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/bets/games?${queryString}`,
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
    params: UpdateBetPayload[keyof UpdateBetPayload],
    fillTournaments?: number[],
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
            ...(fillTournaments ? {fillTournaments} : {}),
        },
    })
    return bets
}

export const importUtlBets = async (
    toTournamentId: number,
    fromTournamentId: number,
): Promise<BetsApiResult> => {
    const { bets = {} } = await sendApiRequest({
        type: 'POST',
        url: `/api/user/utls/${toTournamentId}/import-bets`,
        data: {
            from: fromTournamentId,
        },
    })
    return bets
}
