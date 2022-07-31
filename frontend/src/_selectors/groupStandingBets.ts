import { groupBy } from 'lodash';
import { createSelector } from 'reselect'
import { GroupRankBetWithRelations, GroupWithTeams } from '../types';
import { MyGroupRankBetsById } from './logic';
import { GroupStandingBetsLinked, GroupsWithTeams } from './modelRelations';

export interface GroupWithABet extends GroupWithTeams {
    bet: GroupRankBetWithRelations,
}

export const AllGroupStandingsBets = createSelector(
    GroupStandingBetsLinked,
    GroupsWithTeams,
    (bets, groups) => {
        const betsByGroupId = groupBy(bets, bet => bet.relatedGroup.id);
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
        const groupsWithBet = Object.values(groups).map((group): GroupWithABet => ({
            ...group,
            bet: groupBets[group.id],
        }));
        return {groupsWithBet};
    }
);