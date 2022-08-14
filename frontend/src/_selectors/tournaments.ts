import { createSelector } from 'reselect'
import { HasCurrentUtl, MyUtls } from './base';


export const TournamentUserControllerSelector = createSelector(
    HasCurrentUtl,
    hasCurrentUtl => ({ hasTournamentUser: hasCurrentUtl })
);

export const MyUtlsSelector = createSelector(
    MyUtls,
    myUtls => ({ myUtls })
);