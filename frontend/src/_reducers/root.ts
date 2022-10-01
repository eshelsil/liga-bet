import { combineReducers } from 'redux';
import bets from './bets';
import currentUser from './currentUser';
import groups from './groups';
import leaderboard from './leaderboard';
import matches from './matches';
import myUtls from './myUtls';
import tournamentUTLs from './tournamentUTLs';
import specialQuestions from './specialQuestions';
import teams from './teams';
import tournamentUser from './tournamentUser';
import contestants from './contestants';
import users from './users';
import usersTotalCount from './usersTotalCount';
import ownedTournament from './ownedTournament';
import competitions from './competitions';
import players from './players';
import dialogs from './dialogs';


const reducer = combineReducers({
    bets: bets.reducer,
    teams: teams.reducer,
    leaderboardVersions: leaderboard.reducer,
    specialQuestions: specialQuestions.reducer,
    players: players.reducer,
    matches: matches.reducer,
    groups: groups.reducer,
    currentUser: currentUser.reducer,
    contestants: contestants.reducer,
    myUtls: myUtls.reducer,
    currentTournamentUser: tournamentUser.reducer,
    ownedTournament: ownedTournament.reducer,
    competitions: competitions.reducer,
    tournamentUTLs: tournamentUTLs.reducer,
    users: users.reducer,
    usersTotalCount: usersTotalCount.reducer,
    dialogs: dialogs.reducer,
});

export default reducer;