import { createSelector } from 'reselect'
import { Groups, GroupStandingBets } from './base';
import { MyGroupRankBetsById } from './logic';
import { GroupsWithTeams } from './modelRelations';

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
    GroupsWithTeams,
    MyGroupRankBetsById,
    (groups, groupBets) => {
        const groupsWithBet = Object.values(groups).map(group => ({
            ...group,
            bet: groupBets[group.id],
        }));
        return {groupsWithBet};
    }
);