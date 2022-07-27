import { fetchMatches } from "../api/matches";
import { TournamentIdSelector } from "../_selectors/base";


function updateMatches(data) {
  return {
      type: 'UPDATE_MATCHES',
      data,
  }
}

function fetchAndStoreMatches() {
  return (dispatch, getState) => {
    const tournamentId = TournamentIdSelector(getState());
    return fetchMatches(tournamentId)
    .then( data => dispatch(updateMatches(data)) );
  }
}


export {
  fetchAndStoreMatches,
}