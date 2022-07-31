import { fetchMatches } from '../api/matches';
import { AppDispatch, GetRootState } from '../_helpers/store';
import matches from '../_reducers/matches';
import { TournamentIdSelector } from '../_selectors/base';


function fetchAndStoreMatches() {
  return (dispatch: AppDispatch, getState: GetRootState) => {
    const tournamentId = TournamentIdSelector(getState());
    return fetchMatches(tournamentId)
      .then( data => dispatch(matches.actions.updateMany(data)) );
  }
}


export {
  fetchAndStoreMatches,
}