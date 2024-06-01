import { createSelector } from 'reselect'
import {
    CurrentTournamentUser,
    IsTournamentStarted,
} from './base'
import { IsAppMenuEmpty, IsWhatifOn } from './logic'

export const AppHeaderSelector = createSelector(
    IsTournamentStarted,
    CurrentTournamentUser,
    IsAppMenuEmpty,
    IsWhatifOn,
    (isTournamentStarted, currentUtl, isAppMenuEmpty, isWhatifOn) => ({
        isTournamentStarted,
        currentUtl,
        isAppMenuEmpty,
        isWhatifOn
    })
)
