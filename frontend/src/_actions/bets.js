import { fetchBets, sendBet } from "../api/bets.ts";
import { TournamentIdSelector } from "../_selectors/base";

function updateBets(data) {
  return {
      type: 'UPDATE_BETS',
      data,
  }
}

function updateBet(bet) {
  const { id } = bet;
  return {
    type: 'UPDATE_BET',
    data: bet,
    id,
  }
}

function fetchAndStoreBets() {
  return (dispatch, getState) => {
    const tournamentId = TournamentIdSelector(getState());
    return fetchBets(tournamentId)
    .then( data => dispatch(updateBets(data)) );
  }
}

function sendBetAndStore(params){
  const {betType, ...restParams} = params;
  return (dispatch, getState) => {
    const tournamentId = TournamentIdSelector(getState());
    return sendBet(tournamentId, betType, restParams)
    .then( data => dispatch(updateBets(data)) );
  }
}

export {
  fetchAndStoreBets,
  sendBetAndStore,
}