import { createSelector } from 'reselect'
import { CurrentUserName, IsTournamentStarted} from './base';


export const AppHeaderSelector = createSelector(
    CurrentUserName,
    IsTournamentStarted,
    (currentUserName, isTournamentStarted) => ({
        currentUserName,
        isTournamentStarted,
    })
);
