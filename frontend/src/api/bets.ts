import { BetApiModel, BetType, MatchBetApiModel, WinnerSide } from '../types'
import { FetchGameBetsParams, GameBetsFetchType } from '../types/dataFetcher'
import { sendApiRequest } from './common/apiRequest'

type BetsApiResult = Record<number, BetApiModel>


export const fetchMatchBets = async (
    { type, ids, tournamentId }: FetchGameBetsParams,
): Promise<Record<number, MatchBetApiModel>> => {
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

export interface BetSubmission {
    type: BetType
    data: Record<string, unknown>
}

/**
 * Submit one or more bets in a single request. Sending paired bets together (e.g. bracket
 * Winner + Runner-Up) lets the backend validate them against each other rather than against
 * stale stored values — required so swapping the two picks doesn't trip the "same team" guard.
 */
export const sendBets = async (
    tournamentId: number,
    bets: BetSubmission[],
    fillTournaments?: number[],
): Promise<BetsApiResult> => {
    const { bets: result = {} } = await sendApiRequest({
        type: 'POST',
        url: `/api/tournaments/${tournamentId}/bets`,
        data: {
            bets,
            ...(fillTournaments ? {fillTournaments} : {}),
        },
    })
    return result
}

export const sendBet = async (
    tournamentId: number,
    betType: BetType,
    type_id: number,
    params: UpdateBetPayload[keyof UpdateBetPayload],
    fillTournaments?: number[],
): Promise<BetsApiResult> =>
    sendBets(
        tournamentId,
        [{ type: betType, data: { ...params, type_id } }],
        fillTournaments,
    )

/**
 * Contract E — bracket qualifier bet. A Game bet (BetTypes::Game) carrying only
 * `winner_side`; result fields are omitted/ignored for bracket tournaments.
 * Kept as an explicit function (not folded into MatchBetUpdatePayload) so the
 * classic match-bet payload stays untouched.
 */
export const sendBracketQualifierBet = async (
    tournamentId: number,
    gameId: number,
    winnerSide: WinnerSide,
): Promise<BetsApiResult> => {
    const { bets = {} } = await sendApiRequest({
        type: 'POST',
        url: `/api/tournaments/${tournamentId}/bets`,
        data: {
            bets: [
                {
                    type: BetType.Match,
                    data: { type_id: gameId, winner_side: winnerSide },
                },
            ],
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
