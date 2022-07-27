import { createSelector } from 'reselect'
import { CurrentTournamentUser } from './models';


export const TournamentIdSelector = createSelector(
    CurrentTournamentUser,
    utl => utl.tournament_id
);

// export const CurentTournamentSelector = createSelector(
//     CurrentTournamentUser,
//     currentTournamentUser => currentTournamentUser.tournament ?? {}
// );
    
// export const CompetitionIdSelector = createSelector(
//     CurentTournamentSelector,
//     currentTournament => currentTournament.competition_id
// );