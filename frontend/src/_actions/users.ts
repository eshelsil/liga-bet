import { getUsers, GetUsersParams, updateUser } from '../api/users';
import { AppDispatch } from '../_helpers/store';
import { UserPermissions } from '../types';
import { compactObject } from '../utils';
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

function fetchAndStoreUsers(params?: GetUsersParams) {
  return async (dispatch: AppDispatch) => {
    const users = await getUsers(compactObject(params));
    dispatch(userSlice.actions.set(users));
  }
}


export {
  fetchAndStoreUsers,
  makeTournamentAdmin,
  revokeTournamentAdminPermissions,
}