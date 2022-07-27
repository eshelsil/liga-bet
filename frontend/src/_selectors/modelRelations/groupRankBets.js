import { createSelector } from 'reselect'
import { Groups, GroupStandingBets, Teams, Users } from '../base';


export const GroupStandingBetsWithUserNames = createSelector(
    GroupStandingBets,
    Users,
    (bets, users) => {
        return _.mapValues(bets, bet => ({
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
        const betsWithRelations = _.mapValues(groupRankBets, bet => ({
            ...bet,
            standings: bet.standings?.map(teamId => ({
                ...teams[teamId],
            })),
            relatedGroup: groups[bet.type_id],
        }));
        return _.pickBy(betsWithRelations, bet => bet.relatedGroup);
    }
);

export const GroupStandingBetsByGroupId = createSelector(
    GroupStandingBetsLinked,
    bets => {
        return _.groupBy(Object.values(bets), 'type_id');
    }
);

export const GroupStandingBetsByUserId = createSelector(
    GroupStandingBetsLinked,
    bets => {
        return _.groupBy(Object.values(bets), 'user_tournament_id');
    }
);
