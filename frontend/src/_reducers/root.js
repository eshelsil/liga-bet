import teams from "./teams";
import leaderboard from "./leaderboard";
import specialQuestions from "./specialQuestions";
import matches from "./matches";
import groups from "./groups";
import bets from "./bets";

const init_state = {};

export default function root(state = init_state, action) {
    return {
        teams: teams(state.teams, action),
        leaderboard: leaderboard(state.leaderboard, action),
        specialQuestions: specialQuestions(state.specialQuestions, action),
        matches: matches(state.matches, action),
        groups: groups(state.groups, action),
        bets: bets(state.bets, action),
    }
}