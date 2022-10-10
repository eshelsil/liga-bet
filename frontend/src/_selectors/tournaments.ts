import { createSelector } from 'reselect'
import { HasCurrentUtl, IsConfirmedUtl, MyUtls } from './base'

export const TournamentUserControllerSelector = createSelector(
    HasCurrentUtl,
    IsConfirmedUtl,
    (hasCurrentUtl, isUtlConfirmed) => ({
        hasTournamentUser: hasCurrentUtl,
        isUtlConfirmed,
    })
)

export const MyUtlsSelector = createSelector(MyUtls, (myUtls) => ({ myUtls }))
