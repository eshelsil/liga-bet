import { createSelector } from 'reselect'
import {
    CurrentTournamentUser,
    IsTournamentStarted,
} from './base'
import { IsAppMenuEmpty } from './logic'

export const AppHeaderSelector = createSelector(
    IsTournamentStarted,
    CurrentTournamentUser,
    IsAppMenuEmpty,
    (isTournamentStarted, currentUtl, isAppMenuEmpty) => ({
        isTournamentStarted,
        currentUtl,
        isAppMenuEmpty,
    })
)
