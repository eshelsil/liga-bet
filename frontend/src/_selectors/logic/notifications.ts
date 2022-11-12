import { createSelector } from 'reselect'
import { isGameUpcoming, keysOf, valuesOf } from '../../utils'
import { Games, Groups, Notifications, SpecialQuestions} from '../base'
import { MyGameBetsById, MyGroupRankBetsById, MyQuestionBetsById } from './myBets'
import { MyOtherTournaments } from './tournaments'
import { map, pick } from 'lodash'
import { HasFetchedAllTournamentInitialData } from './dataFetcher'
import { TournamentNotifications } from '../../types'


export const QuestionsMissingBet = createSelector(
    MyQuestionBetsById,
    SpecialQuestions,
    HasFetchedAllTournamentInitialData,
    (questionBets, specialQuestions, fetchedData) => {
        if (!fetchedData) return []
        const questionIds = keysOf(specialQuestions)
        const questionsWithoutBets = questionIds.filter(qId => !questionBets[qId])
        return map(questionsWithoutBets, 'id')
    }
)

export const GamesMissingBet = createSelector(
    Games,
    MyGameBetsById,
    HasFetchedAllTournamentInitialData,
    (games, gameBets, fetchedData) => {
        if (!fetchedData) return []
        const gameIds = keysOf(games)
        const gamesWithoutBets = gameIds.filter(gameId => (
            !gameBets[gameId] && isGameUpcoming(games[gameId])
        ))
        return map(gamesWithoutBets, 'id')
    }
)

export const GroupsMissingBet = createSelector(
    Groups,
    MyGroupRankBetsById,
    HasFetchedAllTournamentInitialData,
    (groups, bets, fetchedData) => {
        if (!fetchedData) return []
        const groupIds = keysOf(groups)
        const groupsWithoutBets = groupIds.filter(gameId => !bets[gameId])
        return map(groupsWithoutBets, 'id')
    }
)

export const MissingBetsByType = createSelector(
    QuestionsMissingBet,
    GamesMissingBet,
    GroupsMissingBet,
    (missingQuestions, missingGames, missingGroups ): TournamentNotifications => {
        return {
            questions: missingQuestions,
            games: missingGames,
            groups: missingGroups,
        }
    }
)

export const MissingQuestionBetsCount = createSelector(
    QuestionsMissingBet,
    (questions) => questions.length
)

export const MissingGameBetsCount = createSelector(
    GamesMissingBet,
    (games) => games.length
)

export const MissingGroupRankBetsCount = createSelector(
    GroupsMissingBet,
    (groups) => groups.length
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