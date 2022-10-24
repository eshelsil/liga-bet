import { groupBy, mapValues } from 'lodash'
import { createSelector } from 'reselect'
import { PlayersById, Team } from '../../types'
import { Players, Teams } from '../base'

export const PlayersWithTeams = createSelector(
    Players,
    Teams,
    (players, teamsById): PlayersById => {
        return mapValues(players, (player) => {
            return {
                ...player,
                team: teamsById[player.team] ?? ({} as Team),
            }
        })
    }
)

export const PlayersByTeamId = createSelector(PlayersWithTeams, (players) => {
    return groupBy(Object.values(players), (p) => {
        return p.team.id
    })
})
