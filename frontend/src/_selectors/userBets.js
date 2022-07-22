import _ from 'lodash';
import { createSelector } from 'reselect'
import { BetTypes } from '../_enums/betTypes';
import { BetsByUserByTypeSelector, CurrentUser } from './main';

// export const MyBetsSelector = BetsByUserByTypeSelector;
export const MyBets = createSelector(
    BetsByUserByTypeSelector,
    CurrentUser,
    (betsByUserID, currentUser) => {
        const { id: userId } = currentUser;
        const res =  { betsByType: betsByUserID[userId]};
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