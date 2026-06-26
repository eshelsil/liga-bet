import { mapValues, without } from 'lodash'
import {
    fetchMatchBets,
    sendBet,
    sendBets,
    sendBracketQualifierBet,
    UpdateBetPayload,
    fetchPrimalBets,
} from '../api/bets'
import { CollectionName, BetType, FetchGameBetsParams, GameBetsFetchType, WinnerSide } from '../types'
import { AppDispatch, GetRootState } from '../_helpers/store'
import betsSlice from '../_reducers/bets'
import { CurrentGameBetsFetcher, CurrentTournamentUserId, MyOtherTournaments, PrimalBets, TournamentIdSelector } from '../_selectors'
import gameBetsFetcher from '../_reducers/gameBetsFetcher'
import { generateInitCollectionAction } from './utils'
import { fetchAndStoreNotifications } from './notifications'


function fetchAndStoreGameBets(params: FetchGameBetsParams) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const { tournamentId } = params
        const bets = await fetchMatchBets(params)
        const formattedBets = mapValues(bets, bet => ({
            ...bet,
            result_home: bet.result_home ? Number(bet.result_home) : bet.result_home,
            result_away: bet.result_away ? Number(bet.result_away) : bet.result_away, // handling legacy monkey-bets-data
        }))
        dispatch(betsSlice.actions.updateMany({tournamentId, bets: formattedBets}))
    }
}

function fetchMyGameBets() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const utlId = CurrentTournamentUserId(getState())
        const tournamentId = TournamentIdSelector(getState())
        const params = {tournamentId, type: GameBetsFetchType.Users, ids: [utlId, 3]};
        return fetchAndStoreGameBets(params)(dispatch, getState)
    }
}

function fetchAndStorePrimalBets() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = TournamentIdSelector(getState())
        const bets = await fetchPrimalBets(tournamentId)
        dispatch(betsSlice.actions.updateMany({tournamentId, bets: bets}))
    }
}

export interface SendBetParams<T extends keyof UpdateBetPayload> {
    type_id: number
    betType: BetType
    payload: UpdateBetPayload[T]
    forAllTournaments?: boolean
}
export type SendMatchBetParams = SendBetParams<BetType.Match>
export type SendGroupRankBetParams = SendBetParams<BetType.GroupsRank>
export type SendQuestionBetParams = SendBetParams<BetType.Question>

function sendBetAndStore(params: SendBetParams<BetType>) {
    const { betType, type_id, payload, forAllTournaments } = params
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = TournamentIdSelector(getState())
        let fillTournaments: number[]
        if (forAllTournaments){
            fillTournaments = MyOtherTournaments(getState())
        }
        const bets = await sendBet(tournamentId, betType, type_id, payload, fillTournaments)
        dispatch(betsSlice.actions.updateOnManyTournaments(bets))
        dispatch(fetchAndStoreNotifications())
    }
}

// Submit several Question (SpecialBet) answers in ONE request so the backend can validate them as a
// set — used for the bracket Winner + Runner-Up pair, where a swap must not see a stale stored value.
function sendQuestionBetsAndStore(answers: { betId: number; teamId: number }[]) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        if (answers.length === 0) return
        const tournamentId = TournamentIdSelector(getState())
        const bets = await sendBets(
            tournamentId,
            answers.map(({ betId, teamId }) => ({
                type: BetType.Question,
                data: { type_id: betId, answer: teamId },
            })),
        )
        dispatch(betsSlice.actions.updateOnManyTournaments(bets))
        dispatch(fetchAndStoreNotifications())
    }
}

// Contract E — submit a bracket qualifier pick (Game bet, winner_side only).
function sendBracketQualifierBetAndStore(gameId: number, side: WinnerSide) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = TournamentIdSelector(getState())
        const bets = await sendBracketQualifierBet(tournamentId, gameId, side)
        dispatch(betsSlice.actions.updateOnManyTournaments(bets))
        dispatch(fetchAndStoreNotifications())
    }
}

const initPrimalBets = generateInitCollectionAction({
    collectionName: CollectionName.PrimalBets,
    selector: PrimalBets,
    fetchAction: fetchAndStorePrimalBets,
})

function fetchGameBetsThunk(params: FetchGameBetsParams){
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const { fetched, currentlyFetching } = CurrentGameBetsFetcher(getState())[params.type];
        const relevantIds = without(params.ids, ...fetched)
        const newIds = without(relevantIds, ...currentlyFetching)
        const skipFetch = newIds.length === 0;
        if (skipFetch) {
            return;
        }

        const fetchParams = {
            ...params,
            ids: relevantIds,
        };
        dispatch(gameBetsFetcher.actions.fetch(fetchParams))
        dispatch(fetchAndStoreGameBets(params))
            .then(() => dispatch(gameBetsFetcher.actions.resolve(fetchParams)))
            .catch(
                (error) => dispatch(
                    gameBetsFetcher.actions.reject({
                        ...fetchParams,
                        error: error?.responseJSON?.message ?? JSON.stringify(error)
                    })
                )
            )
    }
}

export { fetchAndStorePrimalBets, fetchMyGameBets, initPrimalBets, sendBetAndStore, sendQuestionBetsAndStore, sendBracketQualifierBetAndStore, fetchAndStoreGameBets, fetchGameBetsThunk }
