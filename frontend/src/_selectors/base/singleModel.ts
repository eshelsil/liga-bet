import { createSelector } from 'reselect'
import { isAdmin } from '../../utils';
import { CurrentTournament, CurrentUser } from './models';


export const TournamentIdSelector = createSelector(
    CurrentTournament,
    tournament => tournament.id,
);

export const IsTournamentStarted = createSelector(
    CurrentTournament,
    tournament => true, // only for development
    // tournament => isTournamentStarted(tournament),
);

export const IsAdmin = createSelector(
    CurrentUser,
    user => isAdmin(user),
);

export const CurrentUserName = createSelector(
    CurrentUser,
    user => user.name,
);