import { createSelector } from 'reselect'
import {
    CurrentTournamentUser,
    CurrentUserEmail,
    IsTournamentStarted,
} from './base'

export const AppHeaderSelector = createSelector(
    IsTournamentStarted,
    CurrentTournamentUser,
    (isTournamentStarted, currentUtl) => ({
        isTournamentStarted,
        currentUtl,
    })
)
