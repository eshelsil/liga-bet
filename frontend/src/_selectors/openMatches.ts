import { keyBy, sortBy } from 'lodash';
import { createSelector } from 'reselect'
import { Match, MatchBetWithRelations } from '../types';
import { Matches } from './base';
import { MyMatchBetsSelector } from './logic';
import { MatchesWithTeams } from './modelRelations';

export interface MatchWithABet extends Match {
    bet: MatchBetWithRelations
}

export const MyOpenMatchBetsSelector = createSelector(
    MyMatchBetsSelector,
    MatchesWithTeams,
    (myMatchBets, matches) => {
        const matchBetsById = keyBy(myMatchBets, 'type_id');
        const matchesWithBet = Object.values(matches)
            .filter(match => !match.closed_for_bets)
            .map((match): MatchWithABet => ({
                ...match,
                bet: matchBetsById[match.id],
            })
        );
        return {
            matches: sortBy(matchesWithBet, 'start_time'),
        }
    }
);