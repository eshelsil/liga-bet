import { getUserUTLs } from '../api/users';
import tournamentUser from '../_reducers/tournamentUser';
import {AppDispatch} from '../_helpers/store';



function fetchAndStoreCurrentTournamentUser() {
  return (dispatch: AppDispatch) => {
      return getUserUTLs()
      .then( data => {
        const theOnlyTournament = data[0];
        dispatch(tournamentUser.actions.set(theOnlyTournament));
      })
  }
}


export {
  fetchAndStoreCurrentTournamentUser,
}