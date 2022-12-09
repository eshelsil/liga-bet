import { Dictionary } from '@reduxjs/toolkit'
import { mapValues, pickBy } from 'lodash'
import { createSelector } from 'reselect'
import { MatchWithGoalsData } from '../types'
import { GameGoalsDataSelector } from './base'
import { MatchesWithTeams, PlayersWithTeams } from './modelRelations'


export const GamesWithGoalsDataSelector = createSelector(
    MatchesWithTeams,
    PlayersWithTeams,
    GameGoalsDataSelector,
    (games, players, goalsDataById): Dictionary<MatchWithGoalsData> => {
        const doneGames = pickBy(games, game => game.is_done)
        return mapValues(doneGames,
            game => ({
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
            })
        )
    }
)
