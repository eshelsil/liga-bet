import { fetchBets } from "../api/bets";

function update_bets(data) {
  return {
      type: 'UPDATE_BETS',
      data,
  }
}

function update_bet(data) {
  const { id, new_data } = data;
  return {
    type: 'UPDATE_BET',
    data: new_data,
    id,
  }
}

function fetch_bets() {
  return (dispatch) => {
    return fetchBets()
    .then( data => dispatch(update_bets(data)) );
  }
}

export {
  fetch_bets,
  update_bet,
}