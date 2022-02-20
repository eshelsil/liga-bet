import { fetchLeaderboard } from "../api/leaderboard"
import { createSingleton } from "./utils"

function set_leaderboard(data) {
  return {
      type: 'SET_LEADERBOARD',
      data,
  }
}
function fetch_leaderboard() {
  return (dispatch) => {
    return fetchLeaderboard()
    .then( data => dispatch(set_leaderboard(data)) );
  }
}

export {
  fetch_leaderboard,
}