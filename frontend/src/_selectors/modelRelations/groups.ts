import { mapValues, pickBy } from 'lodash'
import { createSelector } from 'reselect'
import { GroupWithTeams, Team } from '../../types'
import { Groups, Teams, TeamsByGroupId } from '../base'

export const GroupsWithTeams = createSelector(
    Groups,
    TeamsByGroupId,
    Teams,
    (groups, teamsByGroupId, teamsById) => {
        const groupsWithTemas = mapValues(groups, (group): GroupWithTeams => {
            const standings =
                group.isDone && Object.keys(teamsById).length > 0
                    ? group.standings.map((team: Team) => teamsById[team.id])
                    : null
            return {
                ...group,
                standings,
                teams: teamsByGroupId[group.id],
            }
        })
        return pickBy(groupsWithTemas, (group) => group.teams)
    }
)
