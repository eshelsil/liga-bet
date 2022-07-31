import { mapValues, pickBy } from 'lodash';
import { createSelector } from 'reselect'
import { GroupWithTeams } from '../../types';
import { Groups, TeamsByGroupId } from '../base';


export const GroupsWithTeams = createSelector(
    Groups,
    TeamsByGroupId,
    (groups, teamsByGroupId) => {
        const groupsWithTemas = mapValues(groups, (group): GroupWithTeams => ({
            ...group,
            teams: teamsByGroupId[group.id],
        }));
        return pickBy(groupsWithTemas, group => group.teams);
    }
);