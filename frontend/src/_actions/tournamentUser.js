import { getUser, getUserUTLs } from "../api/users";

function setCurrentTournamentUser(data) {
  return {
      type: 'SET_CURRENT_TOURNAMENT_USER',
      data,
  }
}

function fetchAndStoreCurrentTournamentUser() {
  return (dispatch) => {
      return getUserUTLs()
      .then( data => {
        const theOnlyTournament = data[0];
        dispatch(setCurrentTournamentUser(theOnlyTournament));
      })
  }
}


export {
  fetchAndStoreCurrentTournamentUser,
}