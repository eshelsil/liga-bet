import { getUser, getUserUTLs } from "../api/users";

function set_current_tournament_user(data) {
  return {
      type: 'SET_CURRENT_TOURNAMENT_USER',
      data,
  }
}

function fetch_current_tournament_user(data) {
  return (dispatch) => {
      return getUserUTLs()
      .then( data => {
        const theOnlyTournament = data[0];
        console.log({theOnlyTournament})
        dispatch(set_current_tournament_user(theOnlyTournament));
      })
  }
}


export {
  fetch_current_tournament_user,
}