import { createSelector } from 'reselect'
import { isTournamentStarted } from '../../utils';
import { CurrentTournament, CurrentUser } from './models';


export const TournamentIdSelector = createSelector(
    CurrentTournament,
    tournament => tournament.id,
);

export const IsTournamentStarted = createSelector(
    CurrentTournament,
    tournament => isTournamentStarted(tournament),
);

export const IsAdmin = createSelector(
    CurrentUser,
    user => user.isAdmin,
);

export const CurrentUserName = createSelector(
    CurrentUser,
    user => user.name,
);

// export const CurentTournamentSelector = createSelector(
//     CurrentTournamentUser,
//     currentTournamentUser => currentTournamentUser.tournament ?? {}
// );
    
// export const CompetitionIdSelector = createSelector(
//     CurentTournamentSelector,
//     currentTournament => currentTournament.competition_id
// );