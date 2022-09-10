import { AppDispatch } from '../_helpers/store';
import currentUser from '../_reducers/currentUser';


function storeCurrentUser() {
  return (dispatch: AppDispatch) => {
    const user = JSON.parse(localStorage.getItem('ligaBetUserData'));
    dispatch(currentUser.actions.set(user));
  }
}

export {
  storeCurrentUser,
}