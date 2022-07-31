import { getUser } from '../api/users';
import { AppDispatch } from '../_helpers/store';
import currentUser from '../_reducers/currentUser';


function fetchAndStoreCurrentUser() {
  return (dispatch: AppDispatch) => {
      return getUser()
        .then( data => dispatch(currentUser.actions.set(data)) );
  }
}

export {
  fetchAndStoreCurrentUser,
}