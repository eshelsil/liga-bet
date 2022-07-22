import { createSelector } from 'reselect'
import { Groups, GroupStandingBets, QuestionBets, SpecialQuestions, Users } from './main';
import { MyGroupRankBetsSelector } from './userBets';

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

export const OpenGroupRankBetsSelector = createSelector(
    Groups,
    MyGroupRankBetsSelector,
    (groups, groupBets) => {
        const groupsWithBet = Object.values(groups).map(group => ({
            ...group,
            bet: groupBets[group.id],
        }));
        return {groupsWithBet};
    }
);