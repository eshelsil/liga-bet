import { groupBy, mapValues, pickBy } from 'lodash';
import { createSelector } from 'reselect'
import { MatchBetWithRelations } from '../../types';
import { MatchBets, Matches, Users } from '../base';
import { MatchesWithTeams } from './matches';


export const MatchBetsWithUserNames = createSelector(
    MatchBets,
    Users,
    (bets, users) => {
        return mapValues(bets, bet => ({
            ...bet,
            user_name: users[bet.user_tournament_id]?.name,
        }));
    }
);


export const MatchBetsLinked = createSelector(
    MatchBetsWithUserNames,
    MatchesWithTeams,
    (matchBets, matches) => {
        const betsWithRelatedMatch = mapValues(matchBets, (bet): MatchBetWithRelations => ({
            ...bet,
            relatedMatch: matches[bet.type_id],
        }));
        return pickBy(betsWithRelatedMatch, bet => bet.relatedMatch);
    }
);

export const MatchBetsWithPositiveScores = createSelector(
    MatchBetsLinked,
    bets => {
        return pickBy(bets, bet => bet.score > 0);
    }
);

export const MatchBetsByMatchId = createSelector(
    MatchBetsLinked,
    bets => {
        return groupBy(Object.values(bets), 'type_id');
    }
);

export const MatchBetsByUserId = createSelector(
    MatchBetsLinked,
    bets => {
        return groupBy(Object.values(bets), 'user_tournament_id');
    }
);
