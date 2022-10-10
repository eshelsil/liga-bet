import { createSelector } from 'reselect'
import {
    CurrentTournamentUserId,
    HasManagerPermissions,
    IsTournamentAdmin,
    TournamentUTLs,
} from './base'

export const ManageTournamentUTLsSelector = createSelector(
    TournamentUTLs,
    IsTournamentAdmin,
    CurrentTournamentUserId,
    HasManagerPermissions,
    (utlsById, isTournamentAdmin, currentUtlId, hasManagerPermissions) => {
        return {
            utlsById,
            isTournamentAdmin,
            currentUtlId,
            hasManagerPermissions,
        }
    }
)
