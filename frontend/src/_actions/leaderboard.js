import { fetchLeaderboard } from "../api/leaderboard"

function setLeaderboard(data) {
  return {
      type: 'SET_LEADERBOARD',
      data,
  }
}
function fetchAndStoreLeaderboard() {
  return (dispatch) => {
    return fetchLeaderboard()
    .then( data => dispatch(setLeaderboard(data)) );
  }
}

export {
  fetchAndStoreLeaderboard,
}