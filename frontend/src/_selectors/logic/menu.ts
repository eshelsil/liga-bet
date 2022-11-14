import { createSelector } from 'reselect'
import { HasCurrentUtl, HasManagerPermissions, IsConfirmedUtl } from '../base'


export const IsAppMenuEmpty = createSelector(
    HasCurrentUtl,
    HasManagerPermissions,
    IsConfirmedUtl,
    (hasCurrentUtl, hasManagerPermissions, isConfirmed) => {
        if (!hasCurrentUtl){
            return true
        }
        if (!hasManagerPermissions && !isConfirmed){
            return true
        }
        return false
    }
)