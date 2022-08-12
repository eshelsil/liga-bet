import { groupBy } from 'lodash';
import { createSelector } from 'reselect'
import { GroupWithABet } from '../types';
import { MyGroupRankBetsById } from './logic';
import { GroupStandingBetsLinked, GroupsWithTeams } from './modelRelations';


export const AllGroupStandingsBets = createSelector(
    GroupStandingBetsLinked,
    GroupsWithTeams,
    (bets, groups) => {
        const betsByGroupId = groupBy(bets, bet => bet.relatedGroup.id);
        return {
            betsByGroupId,
            groups: Object.values(groups),
        };
    }
);

export const OpenGroupRankBetsSelector = createSelector(
    GroupsWithTeams,
    MyGroupRankBetsById,
    (groups, groupBets) => {
        const groupsWithBet = Object.values(groups).map((group): GroupWithABet => ({
            ...group,
            bet: groupBets[group.id],
        }));
        return {groupsWithBet};
    }
);