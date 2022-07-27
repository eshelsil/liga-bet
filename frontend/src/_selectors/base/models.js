import { createSelector } from 'reselect'
import { BetTypes } from "../../_enums/betTypes";


export const CurrentUser = state => state.currentUser ?? {};
export const CurrentTournamentUser = state => state.currentTournamentUser ?? {};
export const Users = state => state.users ?? {};
export const Bets = state => state.bets ?? {};
export const Leaderboard = state => state.leaderboard ?? {};
export const Matches = state => state.matches ?? {};
export const Teams = state => state.teams ?? {};
export const Groups = state => state.groups ?? {};
export const SpecialQuestions = state => state.specialQuestions ?? {};
export const Players = state => state.players ?? {};

export const GroupStandingBets = createSelector(
    Bets,
    (bets) => {
        const groupRankBets = _.pickBy(bets, bet => bet.type === BetTypes.GroupsRank);
        return groupRankBets;
    }
);

export const MatchBets = createSelector(
    Bets,
    (bets) => {
        const matchBets = _.pickBy(bets, bet => bet.type === BetTypes.Match);
        return matchBets;
    }
);

export const QuestionBets = createSelector(
    Bets,
    (bets) => {
        const questionBets = _.pickBy(bets, bet => bet.type === BetTypes.SpecialBet);
        return questionBets;
    }
);


export const TeamsByGroupId = createSelector(
    Teams,
    (teams) => {
        return _.groupBy(teams, 'group_id');
    }
);