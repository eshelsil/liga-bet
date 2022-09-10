import { getUsers, updateUser } from '../api/users';
import { AppDispatch } from '../_helpers/store';
import { UserPermissions } from '../types';
import userSlice from '../_reducers/users';


function revokeTournamentAdminPermissions(userId: number){
  return async (dispatch: AppDispatch) => {
    const user = await updateUser(userId, {permissions: UserPermissions.User});
    dispatch(userSlice.actions.updateOne(user));
  }
}

function makeTournamentAdmin(userId: number){
  return async (dispatch: AppDispatch) => {
    const user = await updateUser(userId, {permissions: UserPermissions.TournamentAdmin});
    dispatch(userSlice.actions.updateOne(user));
  }
}

function fetchAndStoreUsers() {
  return async (dispatch: AppDispatch) => {
    const users = await getUsers();
    dispatch(userSlice.actions.set(users));
  }
}


export {
  fetchAndStoreUsers,
  makeTournamentAdmin,
  revokeTournamentAdminPermissions,
}