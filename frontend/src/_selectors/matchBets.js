import { createSelector } from 'reselect'
import { getMatchBetValue } from '../utils/bet_values_generators';
import { MatchBetsById, Matches } from './main';

export const ClosedMatchBetsSelector = createSelector(
    MatchBetsById,
    Matches,
    (matchBetsByMatchId, matches) => {
        const done_matches = [];
        const live_matches = [];
        for (const match of Object.values(matches)){
            if (!match.closed_for_bets) continue;
            const bets = matchBetsByMatchId[match.id] ?? [];
            const betsByValue = _.groupBy(bets, getMatchBetValue);
            const matchWithBetsByValue = {
                ...match,
                betsByValue,
            }
            if (match.is_done){
                done_matches.push(matchWithBetsByValue);
            } else {
                live_matches.push(matchWithBetsByValue);
            }
        }
        return {
            done_matches,
            live_matches,
        };
    }
);