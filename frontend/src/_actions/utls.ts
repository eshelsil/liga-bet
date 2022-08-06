import { fetchUsers } from '../api/users';
import { AppDispatch } from '../_helpers/store';
import utls from '../_reducers/contestants';


function fetchAndStoreUsers() {
  return (dispatch: AppDispatch) => {
    return fetchUsers()
      .then( data => dispatch(utls.actions.set(data)) );
  }
}

export {
  fetchAndStoreUsers,
}