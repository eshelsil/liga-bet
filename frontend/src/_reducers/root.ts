import { combineReducers } from 'redux';
import bets from './bets';
import currentUser from './currentUser';
import groups from './groups';
import leaderboard from './leaderboard';
import matches from './matches';
import specialQuestions from './specialQuestions';
import teams from './teams';
import tournamentUser from './tournamentUser';
import utls from './utls';


const reducer = combineReducers({
    bets: bets.reducer,
    teams: teams.reducer,
    leaderboard: leaderboard.reducer,
    specialQuestions: specialQuestions.reducer,
    matches: matches.reducer,
    groups: groups.reducer,
    users: utls.reducer,
    currentUser: currentUser.reducer,
    currentTournamentUser: tournamentUser.reducer,
});

export default reducer;