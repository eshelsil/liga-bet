import { createSelector } from 'reselect'
import { isGameUpcoming, keysOf } from '../../utils'
import { Games, Groups, SpecialQuestions} from '../base'
import { MyGameBetsById, MyGroupRankBetsById, MyQuestionBetsById } from './myBets'


export const MissingQuestionBetsCount = createSelector(
    MyQuestionBetsById,
    SpecialQuestions,
    (questionBets, specialQuestions) => {
        const questionIds = keysOf(specialQuestions)
        const questionsWithoutBets = questionIds.filter(qId => !questionBets[qId])
        return questionsWithoutBets.length
    }
)

export const MissingGameBetsCount = createSelector(
    Games,
    MyGameBetsById,
    (games, gameBets) => {
        const gameIds = keysOf(games)
        const gamesWithoutBets = gameIds.filter(gameId => (
            !gameBets[gameId] && isGameUpcoming(games[gameId])
        ))
        return gamesWithoutBets.length
    }
)

export const MissingGroupRankBetsCount = createSelector(
    Groups,
    MyGroupRankBetsById,
    (groups, bets) => {
        const groupIds = keysOf(groups)
        const groupsWithoutBets = groupIds.filter(gameId => !bets[gameId])
        return groupsWithoutBets.length
    }
)

export const MissingBetsCount = createSelector(
    MissingQuestionBetsCount,
    MissingGroupRankBetsCount,
    MissingGameBetsCount,
    (qustionsCount, groupRankCount, gamesCount) => {
        return qustionsCount + groupRankCount + gamesCount
    }
)