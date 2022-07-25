import _ from 'lodash';
import { createSelector } from 'reselect'
import { BetsByUserByTypeSelector, CurrentTournamentUser, GroupStandingBetsByUserId, MatchBetsByUserId, QuestionBetsByUserId } from './main';

export const MyBets = createSelector(
    BetsByUserByTypeSelector,
    CurrentTournamentUser,
    (betsByUserID, tournamentUser) => {
        const { id: userId } = tournamentUser;
        return betsByUserID[userId] ?? {}
    }
);

export const MyMatchBetsSelector = createSelector(
    MatchBetsByUserId,
    CurrentTournamentUser,
    (betsByUserId, tournamentUser) => {
        const { id: userId } = tournamentUser;
        return betsByUserId[userId] ?? [];
    }
);

export const MyGroupStandingsBetsSelector = createSelector(
    GroupStandingBetsByUserId,
    CurrentTournamentUser,
    (betsByUserId, tournamentUser) => {
        const { id: userId } = tournamentUser;
        return betsByUserId[userId] ?? [];
    }
);

export const MyQuestionBetsSelector = createSelector(
    QuestionBetsByUserId,
    CurrentTournamentUser,
    (betsByUserId, tournamentUser) => {
        const { id: userId } = tournamentUser;
        return betsByUserId[userId] ?? [];
    }
);

export const MyBetsSelector = createSelector(
    MyMatchBetsSelector,
    MyGroupStandingsBetsSelector,
    MyQuestionBetsSelector,
    (matchBets, groupRankBets, questionBets) => {
        return {
            matchBets,
            groupRankBets,
            questionBets,
        }
    }
);

export const MyGroupRankBetsById = createSelector(
    MyGroupStandingsBetsSelector,
    (bets) => {
        return _.keyBy(bets, 'type_id');
    }
);