import { combineReducers } from 'redux';
import teams from "./teams";
import leaderboard from "./leaderboard";
import specialQuestions from "./specialQuestions";
import matches from "./matches";
import groups from "./groups";
import bets from "./bets";
import utls from "./utls";
import currentUser from "./currentUser";
import tournamentUser from "./tournamentUser";


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