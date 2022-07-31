import { fetchGroups } from '../api/groups';
import { AppDispatch, GetRootState } from '../_helpers/store';
import { TournamentIdSelector } from '../_selectors/base';
import groups from '../_reducers/groups';


function fetchAndStoreGroups() {
  return (dispatch: AppDispatch, getState: GetRootState) => {
    const tournamentId = TournamentIdSelector(getState());
    return fetchGroups(tournamentId)
      .then( data => dispatch(groups.actions.set(data)) );
  }
}


export {
  fetchAndStoreGroups,
}