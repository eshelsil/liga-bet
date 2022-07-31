import { createSelector } from 'reselect'
import { Groups, GroupStandingBets, Teams, Users } from '../base';
import { mapValues, groupBy, pickBy } from 'lodash';
import { GroupRankBetWithRelations } from '../../types';


export const GroupStandingBetsWithUserNames = createSelector(
    GroupStandingBets,
    Users,
    (bets, users) => {
        return mapValues(bets, bet => ({
            ...bet,
            user_name: users[bet.user_tournament_id]?.name,
        }));
    }
);


export const GroupStandingBetsLinked = createSelector(
    GroupStandingBetsWithUserNames,
    Groups,
    Teams,
    (groupRankBets, groups, teams) => {
        const betsWithRelations = mapValues(groupRankBets, (bet): GroupRankBetWithRelations => ({
            ...bet,
            standings: bet.standings?.map(teamId => ({
                ...teams[teamId],
            })),
            relatedGroup: groups[bet.type_id],
        }));
        return pickBy(betsWithRelations, bet => bet.relatedGroup);
    }
);

export const GroupStandingBetsByGroupId = createSelector(
    GroupStandingBetsLinked,
    bets => {
        return groupBy(Object.values(bets), 'type_id');
    }
);

export const GroupStandingBetsByUserId = createSelector(
    GroupStandingBetsLinked,
    bets => {
        return groupBy(Object.values(bets), 'user_tournament_id');
    }
);
