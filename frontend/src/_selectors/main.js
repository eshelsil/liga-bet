import { createSelector } from 'reselect'
import { BetTypes } from '../_enums/betTypes';
import { mapValues } from 'lodash';
import { map } from 'lodash'

// import * as auth from './auth'
// import * as game_conn from './game_connection'
// import * as players from './players'
// import * as server_error from './server_error'


export const Bets = state => state.bets ?? {};
export const Leaderboard = state => state.leaderboard ?? {};
export const Matches = state => state.matches ?? {};
export const Teams = state => state.teams ?? {};

export const LeaderboardSelector = createSelector(
    Leaderboard,
    leaderboard => ({ leaderboard })
);


export const MatchesWithTeams = createSelector(
    Matches,
    Teams,
    (matches, teams) => {
        console.log('teams')
        return mapValues(matches, match => {
            for (const team_key of ['home_team', 'away_team']){
                const team_id = match[team_key];
                const team = teams[team_id];
                if (team){
                    match[team_key] = team;
                }
            }
            return match;
        })
    }
);

export const BetsByUserByTypeSelector = createSelector(
    Bets,
    bets => {
        const res = {};
        for (const bet of Object.values(bets)){
            const { user_id, type, id } = bet;
            if (!res[user_id]){
                res[user_id] = {};
            }
            const userBets = res[user_id];
            if (!userBets[type]){
                userBets[type] = {};
            }
            userBets[type][id] = bet;
        }
        return res;
    }
);

export const ContestantSelector = createSelector(
    MatchesWithTeams,
    BetsByUserByTypeSelector,
    (matchesWithTeams, betsMap) => {
        const res = {};
        for (const [user_id, user_bets] of Object.entries(betsMap)){
            res[user_id] = {};
            for (const [bet_type, betsById] of Object.entries(user_bets)){
                const bets = Object.values(betsById);
                res[user_id][bet_type] = bets;
                if (bet_type == BetTypes.Match){
                    for (const bet of bets){
                        const { data = {} } = bet;
                        const { winner_side, result_home, result_away } = data;
                        bet.relatedMatch = matchesWithTeams[bet.type_id];
                        bet.result_home = result_home;
                        bet.result_away = result_away;
                        bet.winner_side = winner_side;
                    }
                }
            }
        }
        return { contestantBetsData: res, };
    }
);
