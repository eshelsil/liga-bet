import { Dictionary, mapValues, orderBy, pickBy } from 'lodash'
import { createSelector } from 'reselect'
import { SpecialQuestionApiModel, SpecialQuestionType, TournamentWithLinkedUtl } from '../../types'
import {
    getScoreOfUtl,
    getSpecialQuestionName,
    isAdmin,
    isFinalGame,
    isGameLive,
    isTournamentStarted,
    isUtlConfirmed,
    keysOf,
    sortLeaderboardVersions,
    valuesOf,
} from '../../utils'
import {
    CurrentTournament,
    CurrentTournamentUser,
    CurrentUser,
    LeaderboardVersions,
    SpecialQuestions,
    MyUtls,
    Games,
    LeaderboardVersionsState,
    CurrentTournamentUserId,
    AppCrucialLoaders,
    MultiBetsSettings,
} from './models'

export const TournamentIdSelector = createSelector(
    CurrentTournament,
    (tournament) => tournament.id
)
export const IsTournamentStarted = createSelector(
    CurrentTournament,
    tournament => isTournamentStarted(tournament),
)

export const IsAdmin = createSelector(CurrentUser, (user) => isAdmin(user))

export const CurrentUserEmail = createSelector(
    CurrentUser,
    (user) => user.email
)

export const CanUpdateScoreConfig = createSelector(
    CurrentUser,
    (user) => true
)

export const IsConfirmedUtl = createSelector(
    CurrentTournamentUser,
    (utl) => !!utl && isUtlConfirmed(utl)
)

export const LeaderboardVersionsDesc = createSelector(
    LeaderboardVersions,
    (versions) => {
        return sortLeaderboardVersions(versions)
    }
)

export const MyScoreByTournamentId = createSelector(
    LeaderboardVersionsState,
    CurrentTournamentUserId,
    (versionsByTournaentId, utlId) => {
        return mapValues({...versionsByTournaentId}, (versionsByUtlId) => getScoreOfUtl(versionsByUtlId, utlId))
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
        for (const utl of valuesOf(myUtlsById)) {
            const {tournament, ...restUtlAttributes} = utl;
            tournamentsById[utl.tournament.id] = {
                ...utl.tournament,
                linkedUtl: restUtlAttributes,
            };
        }
        return tournamentsById;
    }
)

export const MyTournamentCodes = createSelector(
    MyUtls,
    (myUtlsById) => {
        return valuesOf(myUtlsById).map(utl => utl.tournament.code)
    }
)

export const MyTournamentIds = createSelector(
    MyUtls,
    (myUtlsById) => {
        return valuesOf(myUtlsById).map(utl => utl.tournament.id)
    }
)

export const MyUtlsSorted = createSelector(
    MyUtls,
    (myUtlsById) => {
        return orderBy(valuesOf(myUtlsById), utl => utl.createdAt)
    }
)

export const IsLoadingAppCrucial = createSelector(
    AppCrucialLoaders,
    (loaders) => {
        for (const isLoading of valuesOf(loaders)){
            if (isLoading){
                return true
            }
        }
        return false
    }
)

export const IsMultiBetDefaultForAll = createSelector(
    MultiBetsSettings,
    (settings) => settings.forAllTournaments
)

export const WinnerSpecialQuestionId = createSelector(
    SpecialQuestions,
    (questions) => {
        return valuesOf(questions).find(q => q.type === SpecialQuestionType.Winner)?.id
    }
)

export const RunnerUpSpecialQuestionId = createSelector(
    SpecialQuestions,
    (questions) => {
        return valuesOf(questions).find(q => q.type === SpecialQuestionType.RunnerUp)?.id
    }
)

export const LiveGames = createSelector(
    Games,
    (gamesById) => {
        return pickBy(gamesById, game => isGameLive(game))
    }
)

export const LiveGamesIds = createSelector(
    LiveGames,
    (liveGames) => {
        return keysOf(liveGames) as number[]
    }
)

export const FinalGame = createSelector(
    Games,
    (games) => {
        return valuesOf(games).find(game => isFinalGame(game))
    }
)