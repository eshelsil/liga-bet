import { fetchBets, sendBet } from "../api/bets";
import { TournamentIdSelector } from "../_selectors/base";

function update_bets(data) {
  return {
      type: 'UPDATE_BETS',
      data,
  }
}

function update_bet(bet) {
  const { id } = bet;
  return {
    type: 'UPDATE_BET',
    data: bet,
    id,
  }
}

function fetch_bets() {
  return (dispatch, getState) => {
    const tournamentId = TournamentIdSelector(getState());
    return fetchBets(tournamentId)
    .then( data => dispatch(update_bets(data)) );
  }
}

function send_bet(params){
  const {betType, ...restParams} = params;
  return (dispatch, getState) => {
    const tournamentId = TournamentIdSelector(getState());
    return sendBet(tournamentId, betType, restParams)
    .then( data => dispatch(update_bets(data)) );
  }
}

export {
  fetch_bets,
  send_bet,
}