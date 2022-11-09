import { createSelector } from 'reselect'
import { isGameUpcoming, keysOf, valuesOf } from '../../utils'
import { Games, Groups, Notifications, SpecialQuestions} from '../base'
import { MyGameBetsById, MyGroupRankBetsById, MyQuestionBetsById } from './myBets'
import { MyOtherTournaments } from './tournaments'
import { pick } from 'lodash'
import { HasFetchedAllTournamentInitialData } from './dataFetcher'


export const MissingQuestionBetsCount = createSelector(
    MyQuestionBetsById,
    SpecialQuestions,
    HasFetchedAllTournamentInitialData,
    (questionBets, specialQuestions, fetchedData) => {
        if (!fetchedData) return 0
        const questionIds = keysOf(specialQuestions)
        const questionsWithoutBets = questionIds.filter(qId => !questionBets[qId])
        return questionsWithoutBets.length
    }
)

export const MissingGameBetsCount = createSelector(
    Games,
    MyGameBetsById,
    HasFetchedAllTournamentInitialData,
    (games, gameBets, fetchedData) => {
        if (!fetchedData) return 0
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
    HasFetchedAllTournamentInitialData,
    (groups, bets, fetchedData) => {
        if (!fetchedData) return 0
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

export const HasAllOtherTournamentsNotifications = createSelector(
    Notifications,
    MyOtherTournaments,
    (notifications, otherTournaments) => {
        for (const tournamentId of otherTournaments){
            if (notifications[tournamentId] === undefined){
                return false
            }
        }
        return true
    }
)

export const HasNotificationsOnOtherTournaments = createSelector(
    Notifications,
    MyOtherTournaments,
    (notifications, otherTournaments) => {
        const otherTournamentsNotifications = pick(notifications, otherTournaments)
        return !!valuesOf(otherTournamentsNotifications).find(count => count > 0)
    }
)