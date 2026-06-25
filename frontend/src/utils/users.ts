import { User, UserPermissions } from '../types'
import i18n from '@/i18n/config'

export function isAdmin(user: User) {
    return user.permissions === UserPermissions.Admin
}

export const UserPermissionsToRoleString = {
    [UserPermissions.Admin]: 'Admin',
    [UserPermissions.TournamentAdmin]: 'Tournament Admin',
    [UserPermissions.User]: 'User',
    [UserPermissions.Monkey]: 'Monkey',
}

// Keys ("2" / "1" / "0" / "-1", the UserPermissions enum values) match the
// `utils:userRolesHebrew` locale resource. Proxy keeps the existing
// `UserPermissionsToRoleStringHebrew[permission]` access working while staying
// language-aware (the resource holds both Hebrew and English).
export const UserPermissionsToRoleStringHebrew = new Proxy(
    {} as Record<string | number, string>,
    {
        get: (_target, prop) =>
            i18n.t(`utils:userRolesHebrew.${String(prop)}`, {
                defaultValue: String(prop),
            }),
    }
)
