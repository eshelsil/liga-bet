import { combineReducers } from 'redux';
import bets from './bets';
import currentUser from './currentUser';
import groups from './groups';
import leaderboard from './leaderboard';
import matches from './matches';
import myUtls from './myUtls';
import specialQuestions from './specialQuestions';
import teams from './teams';
import tournamentUser from './tournamentUser';
import contestants from './contestants';


const reducer = combineReducers({
    bets: bets.reducer,
    teams: teams.reducer,
    leaderboard: leaderboard.reducer,
    specialQuestions: specialQuestions.reducer,
    matches: matches.reducer,
    groups: groups.reducer,
    currentUser: currentUser.reducer,
    contestants: contestants.reducer,
    myUtls: myUtls.reducer,
    currentTournamentUser: tournamentUser.reducer,
});

export default reducer;