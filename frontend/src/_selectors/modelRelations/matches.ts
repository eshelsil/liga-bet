import { mapValues, pickBy } from 'lodash'
import { createSelector } from 'reselect'
import { Match } from '../../types'
import { isFinalGame, isGameLive, valuesOf } from '../../utils'
import { Games, Groups, Teams } from '../base'

export const MatchesWithTeams = createSelector(
    Games,
    Teams,
    Groups,
    (matches, teamsById, groups) => {
        const matchesWithTemas = mapValues(
            matches,
            (match): Match => ({
                ...match,
                home_team: teamsById[match.home_team],
                away_team: teamsById[match.away_team],
                ...(isGameLive(match) ? {
                    result_away: match.result_away || 0,
                    result_home: match.result_home || 0,
                } : {}),
                ...(!match.is_knockout && groups[match.subType] ? {
                    group:  groups[match.subType] 
                } : {}),
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

export const FinalGame = createSelector(
    MatchesWithTeams,
    (games) => {
        return valuesOf(games).find(game => isFinalGame(game))
    }
)

export const IsCompetitionDone = createSelector(
    FinalGame,
    (finalGame) => {
        if (finalGame?.is_done) {
            return true
        }
        return false
    }
)
