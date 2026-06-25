import { UtlBase, UtlRole } from '../types'
import i18n from '@/i18n/config'

// Keys (admin / manager / contestant / ...) match the `utils:utlRoles` locale
// resource. Proxy keeps the existing `UtlRoleToString[role]` access working
// while staying language-aware.
export const UtlRoleToString = new Proxy(
    {} as Record<string, string>,
    {
        get: (_target, prop) =>
            i18n.t(`utils:utlRoles.${String(prop)}`, {
                defaultValue: String(prop),
            }),
    }
)

const confirmedUserRoles = [UtlRole.Admin, UtlRole.Manager, UtlRole.Contestant]

export function isUtlConfirmed(utl: UtlBase) {
    return confirmedUserRoles.includes(utl.role)
}

export function isUtlRejected(utl: UtlBase) {
    return utl.role === UtlRole.Rejected
}

export function isUtlWaitingForApproval(utl: UtlBase) {
    return utl.role === UtlRole.NotConfirmed
}

export function hasManagePermissions(utl: UtlBase) {
    return [UtlRole.Admin, UtlRole.Manager].includes(utl?.role)
}
