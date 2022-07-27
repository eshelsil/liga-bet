import { createSelector } from 'reselect'
import { MatchBets, Matches, Users } from '../base';


export const MatchBetsWithUserNames = createSelector(
    MatchBets,
    Users,
    (bets, users) => {
        return _.mapValues(bets, bet => ({
            ...bet,
            user_name: users[bet.user_tournament_id]?.name,
        }));
    }
);


export const MatchBetsLinked = createSelector(
    MatchBetsWithUserNames,
    Matches,
    (matchBets, matches) => {
        const betsWithRelatedMatch = _.mapValues(matchBets, bet => ({
            ...bet,
            relatedMatch: matches[bet.type_id],
        }));
        return _.pickBy(betsWithRelatedMatch, bet => bet.relatedMatch);
    }
);

export const MatchBetsByMatchId = createSelector(
    MatchBetsLinked,
    bets => {
        return _.groupBy(Object.values(bets), 'type_id');
    }
);

export const MatchBetsByUserId = createSelector(
    MatchBetsLinked,
    bets => {
        return _.groupBy(Object.values(bets), 'user_tournament_id');
    }
);
