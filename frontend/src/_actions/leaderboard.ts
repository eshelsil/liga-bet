import { fetchLeaderboard } from '../api/leaderboard';
import {AppDispatch, GetRootState} from '../_helpers/store';
import leaderboard from '../_reducers/leaderboard';
import {TournamentIdSelector} from "../_selectors";


function fetchAndStoreLeaderboard() {
  return (dispatch: AppDispatch, getState: GetRootState) => {
    const tournamentId = TournamentIdSelector(getState());
    return fetchLeaderboard(tournamentId)
    .then( data => dispatch(leaderboard.actions.setRows(data)) );
  }
}

export {
  fetchAndStoreLeaderboard,
}