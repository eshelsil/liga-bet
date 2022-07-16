import { createSelector } from 'reselect'
import { Groups, GroupStandingBets, QuestionBets, SpecialQuestions, Users } from './main';

export const AllGroupStandingsBets = createSelector(
    GroupStandingBets,
    Groups,
    (bets, groups) => {
        const betsByGroupId = _.groupBy(bets, bet => bet.relatedGroup.id);
        return {
            betsByGroupId,
            groups,
        };
    }
);