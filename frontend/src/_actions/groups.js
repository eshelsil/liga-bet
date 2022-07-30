import { fetchGroups } from "../api/groups.ts";
import { TournamentIdSelector } from "../_selectors/base";

function setGroups(data) {
  return {
      type: 'SET_GROUPS',
      data,
  }
}

function fetchAndStoreGroups() {
    return (dispatch, getState) => {
      const tournamentId = TournamentIdSelector(getState());
      return fetchGroups(tournamentId)
      .then( data => dispatch(setGroups(data)) );
  }
}


export {
  fetchAndStoreGroups,
}