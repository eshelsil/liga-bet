import { Dictionary } from '@reduxjs/toolkit';
import { fetchBets, fetchMyBets, fetchClosedMatchBets, sendBet, UpdateBetPayload } from '../api/bets';
import { BetApiModel, BetType } from '../types';
import { AppDispatch, GetRootState } from '../_helpers/store';
import bets from '../_reducers/bets';
import { TournamentIdSelector } from '../_selectors/base';

export enum BetFetchType {
  UserBets = 'userBets',
  MyBets = 'myBets',
  GameBets = 'gameBets',
  GroupBets = 'groupBets',
}

export interface FetchBetsParams {
  id: number,
}


function fetchAndStoreBets(fetchType: BetFetchType, params?: FetchBetsParams) {
  return (dispatch: AppDispatch, getState: GetRootState) => {
    const tournamentId = TournamentIdSelector(getState());
    const storeFunc = (data: Dictionary<BetApiModel>) => dispatch(bets.actions.updateMany(data))
    if (fetchType === BetFetchType.MyBets){
      return fetchMyBets(tournamentId).then(storeFunc);
    }
    if (fetchType === BetFetchType.GameBets){
      return fetchClosedMatchBets(tournamentId).then(storeFunc);
    }
    // return fetchBets(tournamentId)
    //   .then(storeFunc);
  }
}

export interface SendBetParams<T extends keyof UpdateBetPayload> {
  type_id: number,
  betType: BetType,
  payload: UpdateBetPayload[T]
}
export type SendMatchBetParams = SendBetParams<BetType.Match>
export type SendGroupRankBetParams = SendBetParams<BetType.GroupsRank>
export type SendQuestionBetParams = SendBetParams<BetType.Question>

function sendBetAndStore(params: SendBetParams<BetType>){
  const {betType, type_id, payload} = params;
  return async (dispatch: AppDispatch, getState: GetRootState) => {
    const tournamentId = TournamentIdSelector(getState());
    const data = await sendBet(tournamentId, betType, type_id, payload);
    dispatch(bets.actions.updateMany(data));
  }
}

export {
  fetchAndStoreBets,
  sendBetAndStore,
}