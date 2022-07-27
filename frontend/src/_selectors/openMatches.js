import { createSelector } from 'reselect'
import { Matches } from './base';
import { MyMatchBetsSelector } from './logic';

export const MyOpenMatchBetsSelector = createSelector(
    MyMatchBetsSelector,
    Matches,
    (myMatchBets, matches) => {
        const matchBetsById = _.keyBy(myMatchBets, 'type_id');
        const matchesWithBet = Object.values(matches)
            .filter(match => !match.closed_for_bets)
            .map(match => ({
                    ...match,
                    bet: matchBetsById[match.id],
            })
        );
        return {
            matches: _.sortBy(matchesWithBet, 'start_time'),
        }
    }
);