import { User, UserPermissions } from "../types";

export function isAdmin(user: User){
    return user.permissions === UserPermissions.Admin;
}

export const UserPermissionsToRoleString = {
    [UserPermissions.Admin]: 'Admin',
    [UserPermissions.TournamentAdmin]: 'Tournament Admin',
    [UserPermissions.User]: 'User',
    [UserPermissions.Monkey]: 'Monkey',
};