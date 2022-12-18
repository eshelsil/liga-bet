import { Dictionary } from '@reduxjs/toolkit'
import { mapValues, pickBy } from 'lodash'
import { createSelector } from 'reselect'
import { GameGoalsDataById, Match, MatchWithGoalsData, PlayersById } from '../types'
import { isGameLive } from '../utils'
import { GameGoalsDataSelector } from './base'
import { MatchesWithTeams, PlayersWithTeams } from './modelRelations'

function mapScorersData(game: Match, players: PlayersById, goalsDataById: GameGoalsDataById) {
    return {
        ...game,
        scorers: (goalsDataById[game.id] ?? [])
            .map(
                scorer => ({
                    ...scorer,
                    player: players[scorer.playerId]
                })
            )
            .filter(
                scorer => !!scorer.player
            ),
    }
}

export const GamesWithGoalsDataSelector = createSelector(
    MatchesWithTeams,
    PlayersWithTeams,
    GameGoalsDataSelector,
    (games, players, goalsDataById): Dictionary<MatchWithGoalsData> => {
        const doneGames = pickBy(games, game => game.is_done)
        return mapValues(doneGames,
            game => mapScorersData(game, players, goalsDataById)
        )
    }
)

export const LiveGamesWithGoalsDataSelector = createSelector(
    MatchesWithTeams,
    PlayersWithTeams,
    GameGoalsDataSelector,
    (games, players, goalsDataById): Dictionary<MatchWithGoalsData> => {
        const liveGames = pickBy(games, game => isGameLive(game))
        return mapValues(liveGames,
            game => mapScorersData(game, players, goalsDataById)
        )
    }
)
