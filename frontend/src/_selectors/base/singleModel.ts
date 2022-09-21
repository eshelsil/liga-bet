import { orderBy } from 'lodash';
import { createSelector } from 'reselect'
import { isAdmin, isUtlConfirmed } from '../../utils';
import { CurrentTournament, CurrentTournamentUser, CurrentUser, LeaderboardVersions } from './models';


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

export const CurrentUserUsername = createSelector(
    CurrentUser,
    user => user.username,
);

export const IsConfirmedUtl = createSelector(
    CurrentTournamentUser,
    utl => !!utl && isUtlConfirmed(utl),
);

export const LeaderboardVersionsDesc = createSelector(
    LeaderboardVersions,
    (versions) => {
        return orderBy(Object.values(versions), 'created_at', 'desc');
    }
);

export const LatestLeaderboardVersion = createSelector(
    LeaderboardVersionsDesc,
    (versions) => {
        return versions[0] ?? {};
    }
);
