import teams from "./teams";
import leaderboard from "./leaderboard";
import specialQuestions from "./specialQuestions";
import matches from "./matches";
import groups from "./groups";
import bets from "./bets";
import users from "./users";
import currentUser from "./currentUser";
import tournamentUser from "./tournamentUser";

const init_state = {};

export default function root(state = init_state, action) {
    return {
        bets: bets(state.bets, action),
        teams: teams(state.teams, action),
        leaderboard: leaderboard(state.leaderboard, action),
        specialQuestions: specialQuestions(state.specialQuestions, action),
        matches: matches(state.matches, action),
        groups: groups(state.groups, action),
        users: users(state.users, action),
        currentUser: currentUser(state.currentUser, action),
        currentTournamentUser: tournamentUser(state.currentTournamentUser, action),
    }
}