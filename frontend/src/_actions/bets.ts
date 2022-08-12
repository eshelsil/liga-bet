import { Dictionary } from '@reduxjs/toolkit';
import { fetchBets, fetchMyBets, fetchOpenMatchBets, sendBet } from '../api/bets';
import { BetApiModel } from '../types';
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
      return fetchOpenMatchBets(tournamentId).then(storeFunc);
    }
    // return fetchBets(tournamentId)
    //   .then(storeFunc);
  }
}

function sendBetAndStore(params){
  const {betType, ...restParams} = params;
  return (dispatch: AppDispatch, getState: GetRootState) => {
    const tournamentId = TournamentIdSelector(getState());
    return sendBet(tournamentId, betType, restParams)
      .then( data => dispatch(bets.actions.updateMany(data)) );
  }
}

export {
  fetchAndStoreBets,
  sendBetAndStore,
}