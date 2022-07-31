import { createSelector } from 'reselect';
import { BetTypes } from "../../_enums/betTypes";
import { RootState } from '../../_helpers/store';
import { pickBy, groupBy } from 'lodash';
import { BetsApiModelById, GroupRankBetApiModel, MatchBetApiModel, QuestionBetApiModel } from '../../types';


export const CurrentUser = (state: RootState) => state.currentUser;
export const CurrentTournamentUser = (state: RootState) => state.currentTournamentUser;
export const Users = (state: RootState) => state.users;
export const Bets = (state: RootState) => state.bets;
export const Leaderboard = (state: RootState) => state.leaderboard;
export const Matches = (state: RootState) => state.matches;
export const Teams = (state: RootState) => state.teams;
export const Groups = (state: RootState) => state.groups;
export const SpecialQuestions = (state: RootState) => state.specialQuestions;
// export const Players = (state: RootState) => state.players;

export const GroupStandingBets = createSelector(
    Bets,
    (bets) => {
        const groupRankBets = pickBy(bets, bet => bet.type === BetTypes.GroupsRank);
        return groupRankBets as Record<number, GroupRankBetApiModel>;
    }
);

export const MatchBets = createSelector(
    Bets,
    (bets) => {
        const matchBets = pickBy(bets, bet => bet.type === BetTypes.Match);
        return matchBets as Record<number, MatchBetApiModel>;
    }
);

export const QuestionBets = createSelector(
    Bets,
    (bets) => {
        const questionBets = pickBy(bets, bet => bet.type === BetTypes.SpecialBet);
        return questionBets as Record<number, QuestionBetApiModel>;
    }
);


export const TeamsByGroupId = createSelector(
    Teams,
    (teams) => {
        return groupBy(teams, 'group_id');
    }
);