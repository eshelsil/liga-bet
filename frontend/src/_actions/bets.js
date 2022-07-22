import { fetchBets, sendBet } from "../api/bets";

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
    const {currentTournamentUser = {} } = getState();
    const {tournament_id} = currentTournamentUser;
    return fetchBets(tournament_id)
    .then( data => dispatch(update_bets(data)) );
  }
}

function send_bet(params){
  const {betType, ...restParams} = params;
  return (dispatch, getState) => {
    const {currentTournamentUser = {} } = getState();
    const {tournament_id} = currentTournamentUser;
    return sendBet(tournament_id, betType, restParams)
    .then( data => dispatch(update_bet(data)) );
  }
}

export {
  fetch_bets,
  send_bet,
}