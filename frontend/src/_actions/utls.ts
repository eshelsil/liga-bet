import { fetchUsers } from '../api/users';
import { AppDispatch } from '../_helpers/store';
import utls from '../_reducers/utls';


function fetchAndStoreUsers() {
  return (dispatch: AppDispatch) => {
    return fetchUsers()
      .then( data => dispatch(utls.actions.set(data)) );
  }
}

export {
  fetchAndStoreUsers,
}