import { createSelector } from 'reselect'
import { Groups, TeamsByGroupId } from '../base';


export const GroupsWithTeams = createSelector(
    Groups,
    TeamsByGroupId,
    (groups, teamsByGroupId) => {
        const groupsWithTemas = _.mapValues(groups, group => ({
            ...group,
            teams: teamsByGroupId[group.id],
        }));
        return _.pickBy(groupsWithTemas, group => group.teams);
    }
);