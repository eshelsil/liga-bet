import { UtlRole } from "../types";

export const UtlRoleToString = {
    [UtlRole.Admin]: 'אדמין',
    [UtlRole.Manager]: 'מנהל',
    [UtlRole.Contestant]: 'משתתף',
    [UtlRole.NotConfirmed]: 'טרם אושר',
    [UtlRole.Monkey]: 'קוף',
};