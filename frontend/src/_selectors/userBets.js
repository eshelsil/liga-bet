import _ from 'lodash';
import { createSelector } from 'reselect'
import { BetTypes } from '../_enums/betTypes';
import { BetsByUserByTypeSelector, CurrentTournamentUser } from './main';

export const MyBets = createSelector(
    BetsByUserByTypeSelector,
    CurrentTournamentUser,
    (betsByUserID, tournamentUser) => {
        const { id: userId } = tournamentUser;
        return betsByUserID[userId] ?? {}
    }
);

export const MyBetsSelector = createSelector(
    MyBets,
    (betsByType) => ({betsByType})
);

export const MyMatchBetsSelector = createSelector(
    MyBets,
    (myBetsByType) => {
        const matchBets = myBetsByType[BetTypes.Match] ?? [];
        return _.keyBy(matchBets, 'type_id');
    }
);

export const MyGroupRankBetsSelector = createSelector(
    MyBets,
    (myBetsByType) => {
        const matchBets = myBetsByType[BetTypes.GroupsRank] ?? [];
        return _.keyBy(matchBets, 'type_id');
    }
);