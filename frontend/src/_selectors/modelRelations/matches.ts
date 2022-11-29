import { mapValues, pickBy } from 'lodash'
import { createSelector } from 'reselect'
import { Match } from '../../types'
import { isGameLive } from '../../utils'
import { Games, Teams } from '../base'

export const MatchesWithTeams = createSelector(
    Games,
    Teams,
    (matches, teamsById) => {
        const matchesWithTemas = mapValues(
            matches,
            (match): Match => ({
                ...match,
                home_team: teamsById[match.home_team],
                away_team: teamsById[match.away_team],
                ...(isGameLive(match) ? {
                    result_away: match.result_away || 0,
                    result_home: match.result_home || 0,
                } : {})
            })
        )
        return pickBy(
            matchesWithTemas,
            (match) => match.home_team && match.away_team
        )
    }
)

export const GroupStageGames = createSelector(MatchesWithTeams, (matches) => {
    return pickBy(matches, (game) => !game.is_knockout)
})

export const GroupStageGamesCount = createSelector(
    GroupStageGames,
    (games) => Object.keys(games).length
)
