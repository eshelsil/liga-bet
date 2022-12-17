import { createSelector } from 'reselect'
import { FinalGame, HasCurrentUtl, HasManagerPermissions, IsConfirmedUtl } from '../base'


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

export const ManageTournamentIsAccessible = createSelector(
    FinalGame,
    (final) => {
        if (final) {
            return false
        }
        return true
    }
)