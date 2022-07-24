import { fetchGames } from "../api/matches";


function update_matches(data) {
  return {
      type: 'UPDATE_MATCHES',
      data,
  }
}

function fetch_matches() {
  return (dispatch, getState) => {
      const {currentTournamentUser = {} } = getState();
      const {tournament_id} = currentTournamentUser;
      return fetchGames(tournament_id)
      .then( data => dispatch(update_matches(data)) );
  }
}


export {
  fetch_matches,
}