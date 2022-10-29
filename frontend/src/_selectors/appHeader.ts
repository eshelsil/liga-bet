import { createSelector } from 'reselect'
import {
    CurrentTournamentUser,
    CurrentUserEmail,
    IsTournamentStarted,
} from './base'

export const AppHeaderSelector = createSelector(
    CurrentUserEmail,
    IsTournamentStarted,
    CurrentTournamentUser,
    (currentUserEmail, isTournamentStarted, currentUtl) => ({
        currentUsername: currentUserEmail,
        isTournamentStarted,
        currentUtl,
    })
)
