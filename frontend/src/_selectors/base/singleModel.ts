import { Dictionary, mapValues, orderBy } from 'lodash'
import { createSelector } from 'reselect'
import { SpecialQuestionApiModel, TournamentWithLinkedUtl } from '../../types'
import {
    getSpecialQuestionName,
    isAdmin,
    isTournamentStarted,
    isUtlConfirmed,
    keysOf,
} from '../../utils'
import {
    CurrentTournament,
    CurrentTournamentUser,
    CurrentUser,
    LeaderboardVersions,
    SpecialQuestions,
    MyUtls,
    Games,
} from './models'

export const TournamentIdSelector = createSelector(
    CurrentTournament,
    (tournament) => tournament.id
)
export const IsTournamentStarted = createSelector(
    CurrentTournament,
    (tournament) => false // only for development
    // tournament => isTournamentStarted(tournament),
)

export const IsAdmin = createSelector(CurrentUser, (user) => isAdmin(user))

export const CurrentUserName = createSelector(CurrentUser, (user) => user.name)

export const CurrentUserUsername = createSelector(
    CurrentUser,
    (user) => user.username
)

export const IsConfirmedUtl = createSelector(
    CurrentTournamentUser,
    (utl) => !!utl && isUtlConfirmed(utl)
)

export const LeaderboardVersionsDesc = createSelector(
    LeaderboardVersions,
    (versions) => {
        return orderBy(Object.values(versions), 'created_at', 'desc')
    }
)

export const LatestLeaderboardVersion = createSelector(
    LeaderboardVersionsDesc,
    (versions) => {
        return versions[0] ?? {}
    }
)

export const GameIds = createSelector(
    Games,
    (gamesById) => {
        return keysOf(gamesById);
    }
)

function formatSpecialAnswer(answer: SpecialQuestionApiModel['answer']) {
    if (!answer) return []
    return Array.isArray(answer) ? answer : [answer]
}

export const SpecialQuestionsFormatted = createSelector(
    SpecialQuestions,
    (specialQuestions) => {
        return mapValues(specialQuestions, (question) => {
            const { answer } = question
            return {
                ...question,
                name: getSpecialQuestionName(question),
                answer: formatSpecialAnswer(answer),
            }
        })
    }
)


export const TournamentsWithMyUtl = createSelector(
    MyUtls,
    (myUtlsById) => {
        const tournamentsById: Dictionary<TournamentWithLinkedUtl> = {}
        for (const utl of Object.values(myUtlsById)) {
            const {tournament, ...restUtlAttributes} = utl;
            tournamentsById[utl.tournament.id] = {
                ...utl.tournament,
                linkedUtl: restUtlAttributes,
            };
        }
        return tournamentsById;
    }
)

