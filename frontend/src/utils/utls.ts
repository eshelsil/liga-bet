import { UtlBase, UtlRole } from "../types";

export const UtlRoleToString = {
    [UtlRole.Admin]: 'אדמין',
    [UtlRole.Manager]: 'מנהל',
    [UtlRole.Contestant]: 'משתתף',
    [UtlRole.NotConfirmed]: 'טרם אושר',
    [UtlRole.Rejected]: 'לא אושר',
    [UtlRole.Monkey]: 'קוף',
};

const confirmedUserRoles = [
    UtlRole.Admin,
    UtlRole.Manager,
    UtlRole.Contestant,
];

export function isUtlConfirmed(utl: UtlBase){
    return confirmedUserRoles.includes(utl.role);
}

export function isUtlRejected(utl: UtlBase){
    return utl.role === UtlRole.Rejected;
}

export function isUtlWaitingForApproval(utl: UtlBase){
    return utl.role === UtlRole.NotConfirmed;
}

export function hasManagePermissions(utl: UtlBase){
    return [UtlRole.Admin, UtlRole.Manager].includes(utl?.role);
}