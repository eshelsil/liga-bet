import { AppDispatch } from '../_helpers/store';
import currentUser from '../_reducers/currentUser';


function storeCurrentUser() {
  return (dispatch: AppDispatch) => {
    const user = JSON.parse(localStorage.getItem('ligaBetUserData'));
    const userData = {
      ...user,
      isConfirmed: user.permissions > 0,
      isAdmin: user.permissions >= 2,
    };
    dispatch(currentUser.actions.set(userData));
  }
}

export {
  storeCurrentUser,
}