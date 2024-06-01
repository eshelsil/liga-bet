import { createSelector } from 'reselect'
import { WhatifsGamesData } from '../base'
import { MatchesWithTeams } from './matches'
import { mapValues, pickBy } from 'lodash'
import { getWinnerSide } from '@/utils'

export const WhatifsGamesDataWithRelations = createSelector(
    WhatifsGamesData,
    MatchesWithTeams,
    (whatifGamesData, gamesById) => {
        return pickBy(
            mapValues(whatifGamesData, (whatifGame, gameId) => {
                const hasResultData =
                    typeof whatifGame.result?.home === 'number' &&
                    typeof whatifGame.result?.away === 'number'
                const hasQualifierData =
                    !!whatifGame.result?.qualifier ||
                    (hasResultData &&
                        !!getWinnerSide(
                            whatifGame.result?.home,
                            whatifGame.result?.away
                        ))
                return {
                    ...whatifGame,
                    game: gamesById[gameId]
                        ? {
                              ...gamesById[gameId],
                              ...(hasResultData
                                  ? {
                                        result_home: whatifGame.result.home,
                                        result_away: whatifGame.result.away,
                                    }
                                  : {}),
                              ...(hasQualifierData
                                  ? {
                                        winner_side:
                                            whatifGame.result.qualifier ??
                                            getWinnerSide(
                                                whatifGame.result.home,
                                                whatifGame.result.away
                                            ),
                                    }
                                  : {}),
                          }
                        : undefined,
                }
            }),
            (whatifGame) => !!whatifGame.game
        )
    }
)
