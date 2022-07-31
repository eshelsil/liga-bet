import { fetchBets, sendBet } from '../api/bets';
import { AppDispatch, GetRootState } from '../_helpers/store';
import bets from '../_reducers/bets';
import { TournamentIdSelector } from '../_selectors/base';


function fetchAndStoreBets() {
  return (dispatch: AppDispatch, getState: GetRootState) => {
    const tournamentId = TournamentIdSelector(getState());
    return fetchBets(tournamentId)
      .then( data => bets.actions.updateMany(data) );
  }
}

function sendBetAndStore(params){
  const {betType, ...restParams} = params;
  return (dispatch: AppDispatch, getState: GetRootState) => {
    const tournamentId = TournamentIdSelector(getState());
    return sendBet(tournamentId, betType, restParams)
      .then( data => bets.actions.updateMany(data) );
  }
}

export {
  fetchAndStoreBets,
  sendBetAndStore,
}