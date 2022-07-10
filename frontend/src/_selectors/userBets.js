import { createSelector } from 'reselect'
import { BetsByUserByTypeSelector, CurrentUser } from './main';

// export const MyBetsSelector = BetsByUserByTypeSelector;
export const MyBetsSelector = createSelector(
    BetsByUserByTypeSelector,
    CurrentUser,
    (betsByUserID, currentUser) => {
        console.log({currentUser, betsByUserID})
        const { id: userId } = currentUser;
        console.log({userId})
        const res =  { betsByType: betsByUserID[userId]};
        return res;
    }
);