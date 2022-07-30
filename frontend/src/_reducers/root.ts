import { combineReducers } from 'redux';
import teams from "./teams";
import leaderboard from "./leaderboard";
import specialQuestions from "./specialQuestions";
import matches from "./matches";
import groups from "./groups";
import bets from "./bets";
import users from "./users";
import currentUser from "./currentUser";
import tournamentUser from "./tournamentUser";


const reducer = combineReducers({
    bets: bets,
    teams: teams,
    leaderboard: leaderboard,
    specialQuestions: specialQuestions,
    matches: matches,
    groups: groups,
    users: users,
    currentUser: currentUser,
    currentTournamentUser: tournamentUser.reducer,
});

export default reducer;