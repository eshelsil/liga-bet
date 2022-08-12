import { keyBy, sortBy } from 'lodash';
import { createSelector } from 'reselect'
import { MatchWithABet } from '../types';
import { MyMatchBetsSelector } from './logic';
import { MatchesWithTeams } from './modelRelations';


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