import { createSelector } from 'reselect'
import {
    CurrentTournamentUser,
    CurrentUserUsername,
    IsTournamentStarted,
} from './base'

export const AppHeaderSelector = createSelector(
    CurrentUserUsername,
    IsTournamentStarted,
    CurrentTournamentUser,
    (currentUsername, isTournamentStarted, currentUtl) => ({
        currentUsername,
        isTournamentStarted,
        currentUtl,
    })
)
