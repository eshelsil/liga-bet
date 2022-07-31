import { fetchLeaderboard } from '../api/leaderboard';
import { AppDispatch } from '../_helpers/store';
import leaderboard from '../_reducers/leaderboard';


function fetchAndStoreLeaderboard() {
  return (dispatch: AppDispatch) => {
    return fetchLeaderboard()
    .then( data => dispatch(leaderboard.actions.set(data)) );
  }
}

export {
  fetchAndStoreLeaderboard,
}