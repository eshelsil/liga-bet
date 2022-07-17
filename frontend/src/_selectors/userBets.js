import _ from 'lodash';
import { createSelector } from 'reselect'
import { BetTypes } from '../_enums/betTypes';
import { BetsByUserByTypeSelector, CurrentUser } from './main';

// export const MyBetsSelector = BetsByUserByTypeSelector;
export const MyBetsSelector = createSelector(
    BetsByUserByTypeSelector,
    CurrentUser,
    (betsByUserID, currentUser) => {
        const { id: userId } = currentUser;
        const res =  { betsByType: betsByUserID[userId]};
        return res;
    }
);

export const MyMatchBetsSelector = createSelector(
    MyBetsSelector,
    (myBetsByType) => {
        const matchBets = myBetsByType[BetTypes.Match] ?? [];
        return _.keyBy(matchBets, 'type_id');
    }
);