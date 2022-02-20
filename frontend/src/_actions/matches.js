import { fetchMatches } from "../api/matches";


function update_matches(data) {
  return {
      type: 'UPDATE_MATCHES',
      data,
  }
}

function fetch_matches() {
  return (dispatch) => {
    return fetchMatches()
    .then( data => dispatch(update_matches(data)) );
  }
}


export {
  fetch_matches,
}