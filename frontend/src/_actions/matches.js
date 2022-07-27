import { fetchMatches } from "../api/matches";
import { TournamentIdSelector } from "../_selectors/base";


function update_matches(data) {
  return {
      type: 'UPDATE_MATCHES',
      data,
  }
}

function fetch_matches() {
  return (dispatch, getState) => {
    const tournamentId = TournamentIdSelector(getState());
    return fetchMatches(tournamentId)
    .then( data => dispatch(update_matches(data)) );
  }
}


export {
  fetch_matches,
}