import { Dictionary, groupBy, mapValues, orderBy, pickBy } from 'lodash'
import { createSelector } from 'reselect'
import { CompetitionStatus, SpecialQuestionApiModel, SpecialQuestionType, TournamentWithLinkedUtl } from '../../types'
import {
    getSpecialQuestionName,
    isAdmin,
    isGameLive,
    isTournamentLive,
    isTournamentOngoing,
    isTournamentStarted,
    isUtlConfirmed,
    keysOf,
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
    AppCrucialLoaders,
    MultiBetsSettings,
    ScoreboardSettings,
    CurrentLeaderboardsFetcher,
    Competitions,
    NihusGrants,
    Settings,
    Nihusim,
    WhatifState,
} from './models'


export const TournamentIdSelector = createSelector(
    CurrentTournament,
    (tournament) => tournament.id
)
export const IsTournamentStarted = createSelector(
    CurrentTournament,
    tournament => isTournamentStarted(tournament),
)

export const IsTournamentOngoing = createSelector(
    CurrentTournament,
    tournament => isTournamentOngoing(tournament),
)

export const IsAdmin = createSelector(CurrentUser, (user) => isAdmin(user))

export const CanSendNihus = createSelector(CurrentTournamentUser, (utl) => utl?.nihusimLeft > 0)

export const EverGrantedNihus = createSelector(CurrentTournamentUser, (utl) => utl?.nihusimGranted > 0)

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
        return versions
    }
)

export const IsOnNihusim = createSelector(Settings, settings => settings.nihusim)

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

export const LiveTournamentsWithMyUtl = createSelector(
    TournamentsWithMyUtl,
    (tournamentsWithUtl) => {
        return pickBy(tournamentsWithUtl, t => isTournamentLive(t))
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

export const TopScorerSpecialQuestionId = createSelector(
    SpecialQuestions,
    (questions) => {
        return valuesOf(questions).find(q => q.type === SpecialQuestionType.TopScorer)?.id
    }
)

export const TopAssistsSpecialQuestionId = createSelector(
    SpecialQuestions,
    (questions) => {
        return valuesOf(questions).find(q => q.type === SpecialQuestionType.TopAssists)?.id
    }
)

export const MvpSpecialQuestion = createSelector(
    SpecialQuestions,
    (questions) => {
        return valuesOf(questions).find(q => q.type === SpecialQuestionType.MVP)
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

export const UnfinishedGames = createSelector(
    Games,
    (gamesById) => {
        return pickBy(gamesById, game => !game.is_done)
    }
)

export const WhatifsGamesData = createSelector(
    WhatifState,
    (whatifState) => {
        return whatifState.games
    }
)

export const IsShowingLatestLeaderboard = createSelector(
    ScoreboardSettings,
    (settings) => {
        const { upToDateMode, liveMode } = settings
        return upToDateMode && !liveMode
    }
)

export const IsShowingHistoricScoreboard = createSelector(
    ScoreboardSettings,
    (settings) => {
        const { upToDateMode, liveMode, destinationVersion } = settings
        if (liveMode || upToDateMode){
            return false
        }
        return !!destinationVersion
    }
)

export const CurrentlyFetchingLeaderboardVersions = createSelector(
    CurrentLeaderboardsFetcher,
    (fetcher) => {
        return fetcher.currentlyFetching || []
    }
)

export const FetchedLeaderboardVersions = createSelector(
    CurrentLeaderboardsFetcher,
    (fetcher) => {
        return fetcher.fetched || []
    }
)

export const OpenCompetitions = createSelector(
    Competitions,
    (competitions) => {
        return pickBy(competitions, c => c.status === CompetitionStatus.Initial)
    }
)

export const UnseenNihusGrant = createSelector(
    NihusGrants,
    (grantsById) => {
        const grants = valuesOf(grantsById);
        return grants.find(grant => !grant.seen)
    }
)

export const NihusimByGameId = createSelector(
    Nihusim,
    (nihusimById) => {
        return groupBy(valuesOf(nihusimById), nihus => nihus.game_id)
    }
)