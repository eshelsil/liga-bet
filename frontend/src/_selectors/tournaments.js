import { createSelector } from 'reselect'
import { CurrentTournamentUser } from './base';


export const TournamentUserControllerSelector = createSelector(
    CurrentTournamentUser,
    currentTournamentUser => ({ tournamentUser: currentTournamentUser })
);