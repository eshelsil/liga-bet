import { createSelector } from 'reselect'
import { getMatchBetValue } from '../utils/bet_values_generators';
import { MatchBetsById, GroupStandingBets, Matches, QuestionBets, SpecialQuestions, Users } from './main';
import { MyMatchBetsSelector } from './userBets';

export const MyOpenMatchBetsSelector = createSelector(
    MyMatchBetsSelector,
    Matches,
    (myMatchBets, matches) => {
        const matchesWithBet = Object.values(matches)
            .filter(match => !match.closed_for_bets)
            .map(match => ({
                    ...match,
                    bet: myMatchBets[match.id],
            })
        );
        return {
            matches: _.sortBy(matchesWithBet, 'start_time'),
        }
    }
);