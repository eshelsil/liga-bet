import { groupBy } from 'lodash';
import { createSelector } from 'reselect'
import { Match, MatchBetApiModel, MatchBetWithRelations } from '../types';
import { getMatchBetValue } from '../utils';
import { Matches } from './base';
import { MatchBetsByUserId, MatchesWithTeams } from './modelRelations';

export interface MatchWithBets extends Match {
    betsByValue: Record<string, MatchBetApiModel[]>
}

export const ClosedMatchBetsSelector = createSelector(
    MatchBetsByUserId,
    MatchesWithTeams,
    (matchBetsByMatchId, matches) => {
        const done_matches: MatchWithBets[] = [];
        const live_matches: MatchWithBets[] = [];
        for (const match of Object.values(matches)){
            if (!match.closed_for_bets) continue;
            const bets = matchBetsByMatchId[match.id] ?? [];
            const betsByValue = groupBy(bets, getMatchBetValue);
            const matchWithBetsByValue = {
                ...match,
                betsByValue,
            };
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