import { fetchGroups } from "../api/groups";
import { TournamentIdSelector } from "../_selectors/main";

function set_groups(data) {
  return {
      type: 'SET_GROUPS',
      data,
  }
}

function fetch_groups(data) {
    return (dispatch, getState) => {
      const tournamentId = TournamentIdSelector(getState());
      return fetchGroups(tournamentId)
      .then( data => dispatch(set_groups(data)) );
  }
}


export {
  fetch_groups,
}