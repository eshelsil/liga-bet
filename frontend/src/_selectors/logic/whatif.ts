import {
    cloneDeep,
    groupBy,
    isEmpty,
    map,
    mapValues,
    maxBy,
    pickBy,
    union,
} from 'lodash'
import { createSelector } from 'reselect'
import {
    BetsFullScoresConfigSelector,
    FormattedSpecialQuestionsScoreConfig,
    IsRunnerUpBetOn,
    IsSideTournament,
    IsTopAssistsBetOn,
    IsTournamentStarted,
    Players,
    RunnerUpSpecialQuestionId,
    TopAssistsSpecialQuestionId,
    TopScorerSpecialQuestionId,
    UnfinishedGames,
    WhatifState,
    WhatifsGamesData,
    WinnerSpecialQuestionId,
} from '../base'
import {
    FinalGame,
    MatchesWithTeams,
    PlayersWithTeams,
    UnfinishedGameBetsByGameId,
} from '../modelRelations'
import {
    BetType,
    KnockoutStage,
    MatchBetWithRelations,
    SpecialQuestionAnswer,
    Team,
    WinnerSide,
} from '@/types'
import {
    IsFinalGameLiveSelector,
    RunnerUpBetsById,
    TopAssistsBetsById,
    TopScorersBetsById,
    WinnerBetsById,
} from './liveQuestionBets'
import {
    calcGainedPointsOnGameBet,
    generateRandomId,
    getQualifierSide,
    getWinnerSide,
    keysOf,
    koStageToNextCompetitionStage,
    valuesOf,
} from '@/utils'
import { WhatifsGamesDataWithRelations } from '../modelRelations'

export const IsWhatifEnabled = createSelector(
    UnfinishedGames,
    IsTournamentStarted,
    (unfinishedGames, is_tournament_started) => {
        return !isEmpty(unfinishedGames) && is_tournament_started
    }
)

export const IsWhatifOn = createSelector(
    IsWhatifEnabled,
    WhatifState,
    (isEnabled, { isOn }) => {
        return isEnabled && isOn
    }
)

export const WhatifGameIds = createSelector(WhatifsGamesData, (gamesData) => {
    return map(gamesData, 'id')
})

export const UnfinishedGameBetsWithWhatifData = createSelector(
    UnfinishedGameBetsByGameId,
    WhatifsGamesDataWithRelations,
    (betsByGameId, whatifGames) => {
        const res = cloneDeep(betsByGameId)
        for (const gameId of keysOf(whatifGames)) {
            for (const utlId of union(
                keysOf(whatifGames[gameId].betters),
                keysOf(res[gameId] ?? [])
            )) {
                const whatifData = whatifGames[gameId].betters[utlId]
                const game = whatifGames[gameId].game
                const hasResultData =
                    typeof whatifData?.home === 'number' &&
                    typeof whatifData?.away === 'number'
                const hasQualifierData =
                    !!whatifData?.qualifier ||
                    (hasResultData &&
                        !!getWinnerSide(whatifData.home, whatifData.away))
                if (res[gameId][utlId]) {
                    res[gameId][utlId] = {
                        ...res[gameId][utlId],
                        ...(hasResultData
                            ? {
                                  result_home: whatifData.home,
                                  result_away: whatifData.away,
                              }
                            : {}),
                        ...(hasQualifierData
                            ? {
                                  winner_side:
                                      whatifData.qualifier ??
                                      getWinnerSide(
                                          whatifData.home,
                                          whatifData.away
                                      ),
                              }
                            : {}),
                        relatedMatch: game,
                    }
                } else if (hasResultData || hasQualifierData) {
                    res[gameId][utlId] = {
                        relatedMatch: game,
                        result_home: whatifData.home,
                        result_away: whatifData.away,
                        winner_side:
                            whatifData.qualifier ??
                            getWinnerSide(whatifData.home, whatifData.away),
                        id: generateRandomId(),
                        user_tournament_id: utlId,
                        type: BetType.Match,
                        type_id: 1,
                        score: 0,
                    } as MatchBetWithRelations
                }
            }
        }
        return res
    }
)

export const IsFinalGameWhatif = createSelector(
    FinalGame,
    WhatifsGamesDataWithRelations,
    (finalGame, gamesData) => {
        if (!finalGame) {
            return false
        }
        return !!gamesData[finalGame.id]
    }
)

export const WhatifPlayingTeams = createSelector(
    WhatifGameIds,
    MatchesWithTeams,
    (whatifGameIds, gamesById) => {
        const playingTeams: Record<number, Team> = {}
        for (const gameId of whatifGameIds) {
            const game = gamesById[gameId]
            if (!game) {
                continue
            }
            const { away_team, home_team } = game
            playingTeams[away_team.id] = away_team
            playingTeams[home_team.id] = home_team
        }
        return playingTeams
    }
)

export const WhatifTeamsPlayingKnockout = createSelector(
    WhatifGameIds,
    MatchesWithTeams,
    (whatifGameIds, gamesById) => {
        const playingTeams: Record<number, Team> = {}
        for (const gameId of whatifGameIds) {
            const game = gamesById[gameId]
            if (!game || !game.is_knockout) {
                continue
            }
            const { away_team, home_team } = game
            playingTeams[away_team.id] = away_team
            playingTeams[home_team.id] = home_team
        }
        return playingTeams
    }
)

interface ScorerData {
    goals: number
    assists: number
}

type PlayerGoalsDataById = Record<number, ScorerData>

export const WhatifGoalsDataByPlayerId = createSelector(
    WhatifsGamesDataWithRelations,
    (whatifGames) => {
        const whatifScorersData: PlayerGoalsDataById = {}
        for (const whatIfData of valuesOf(whatifGames)) {
            for (const playerId of keysOf(whatIfData.scorers)) {
                if (!whatifScorersData[playerId]) {
                    whatifScorersData[playerId] = {
                        assists: 0,
                        goals: 0,
                    }
                }
                whatifScorersData[playerId].goals = whatIfData.scorers[playerId]
            }
            for (const playerId of keysOf(whatIfData.assists)) {
                if (!whatifScorersData[playerId]) {
                    whatifScorersData[playerId] = {
                        assists: 0,
                        goals: 0,
                    }
                }
                whatifScorersData[playerId].assists =
                    whatIfData.assists[playerId]
            }
        }
        return whatifScorersData
    }
)

export const WhatifScorersById = createSelector(
    Players,
    WhatifGoalsDataByPlayerId,
    (playersById, whatifGoalsDataByPlayerId) => {
        const res = mapValues(playersById, (player) => {
            const whatifGoalsData = whatifGoalsDataByPlayerId[player.id]
            return {
                ...player,
                goals: player.goals + (whatifGoalsData?.goals ?? 0),
                assists: player.assists + (whatifGoalsData?.assists ?? 0),
            }
        })
        return res
    }
)

export const WhatifTopScorersAnswer = createSelector(
    WhatifScorersById,
    IsFinalGameWhatif,
    (scorersById, isFinalGameWhatif) => {
        if (!isFinalGameWhatif) {
            return []
        }
        const scorers = valuesOf(scorersById)
        const maxGoals = maxBy(scorers, 'goals')?.goals
        const topScorers = scorers.filter((scorer) => scorer.goals == maxGoals)
        return map(topScorers, 'id')
    }
)

export const WhatifTopAssistsAnswer = createSelector(
    WhatifScorersById,
    IsFinalGameWhatif,
    (scorersById, isFinalGameWhatif) => {
        if (!isFinalGameWhatif) {
            return []
        }
        const scorers = valuesOf(scorersById)
        const maxAssists = maxBy(scorers, 'assists')?.assists
        const topAssists = scorers.filter(
            (scorer) => scorer.assists == maxAssists
        )
        return map(topAssists, 'id')
    }
)

export const WhatifWinnerBets = createSelector(
    WinnerBetsById,
    WhatifTeamsPlayingKnockout,
    (betsById, playingTeams) => {
        return pickBy(betsById, (bet) => !!playingTeams[bet.answer.id])
    }
)

export const WhatifRunnerUpBets = createSelector(
    RunnerUpBetsById,
    WhatifTeamsPlayingKnockout,
    IsRunnerUpBetOn,
    (betsById, playingTeams, isOn) => {
        if (!isOn) {
            return {}
        }
        return pickBy(betsById, (bet) => !!playingTeams[bet.answer.id])
    }
)

export const WhatifTopScorerBets = createSelector(
    TopScorersBetsById,
    IsFinalGameLiveSelector,
    Players,
    WhatifPlayingTeams,
    (betsById, isFinalGamewhatif, playersById, whatifPlayingTeams) => {
        if (isFinalGamewhatif) {
            return betsById
        }
        return pickBy(betsById, (bet) => {
            const player = playersById[bet.answer?.id]
            if (!player) return false
            const relevantTeamIds = map(whatifPlayingTeams, 'id')
            return relevantTeamIds.includes(player.team)
        })
    }
)

export const WhatifTopAssistsBets = createSelector(
    TopAssistsBetsById,
    IsTopAssistsBetOn,
    IsFinalGameWhatif,
    Players,
    WhatifPlayingTeams,
    IsSideTournament,
    (
        betsById,
        isOn,
        isFinalGameWhatif,
        playersById,
        whatifPlayingTeams,
        isSideTournament
    ) => {
        if (isSideTournament) {
            return {}
        }
        if (!isOn) {
            return {}
        }
        if (isFinalGameWhatif) {
            return betsById
        }
        return pickBy(betsById, (bet) => {
            const player = playersById[bet.answer?.id]
            if (!player) return false
            const relevantTeamIds = map(whatifPlayingTeams, 'id')
            return relevantTeamIds.includes(player.team)
        })
    }
)

export const WhatifWinnerBetsWithScore = createSelector(
    WhatifWinnerBets,
    WhatifsGamesDataWithRelations,
    FormattedSpecialQuestionsScoreConfig,
    (whatifWinnerBets, whatifGamesById, scoresConfig) => {
        const whatifGames = valuesOf(whatifGamesById)
        return valuesOf(whatifWinnerBets).map((bet) => {
            const answer = bet.answer.id
            const whatifGame = whatifGames.find(
                (whatifData) =>
                    whatifData.game.away_team.id === answer ||
                    whatifData.game.home_team.id === answer
            )
            if (!whatifGame) {
                return { ...bet }
            }
            const gameQualifier = getQualifierSide(whatifGame.game)
            let additionalScore = 0
            if (
                (gameQualifier === WinnerSide.Home &&
                    whatifGame.game.home_team.id === answer) ||
                (gameQualifier === WinnerSide.Away &&
                    whatifGame.game.away_team.id === answer)
            ) {
                const qualifyToStage =
                    koStageToNextCompetitionStage[
                        whatifGame.game.subType as KnockoutStage
                    ]
                additionalScore = scoresConfig.winner[qualifyToStage] ?? 0
            }
            return {
                ...bet,
                score: (bet.score || 0) + additionalScore,
            }
        })
    }
)

export const WhatifRunnerUpBetsWithScore = createSelector(
    WhatifRunnerUpBets,
    WhatifsGamesDataWithRelations,
    FormattedSpecialQuestionsScoreConfig,
    (whatIfBets, whatifGamesById, scoresConfig) => {
        const whatifGames = valuesOf(whatifGamesById)
        return valuesOf(whatIfBets).map((bet) => {
            const answer = bet.answer.id
            const whatifData = whatifGames.find(
                (whatifData) =>
                    whatifData.game.away_team.id === answer ||
                    whatifData.game.home_team.id === answer
            )
            if (!whatifData) {
                return { ...bet }
            }
            const game = whatifData.game
            const gameQualifier = getQualifierSide(game)
            let additionalScore = 0
            if (
                (gameQualifier === WinnerSide.Home &&
                    game.home_team.id === answer) ||
                (gameQualifier === WinnerSide.Away &&
                    game.away_team.id === answer)
            ) {
                const qualifyToStage =
                    koStageToNextCompetitionStage[game.subType as KnockoutStage]
                additionalScore = scoresConfig.runnerUp[qualifyToStage] ?? 0
            }
            return {
                ...bet,
                score: (bet.score || 0) + additionalScore,
            }
        })
    }
)

export const WhatifTopScorerBetsWithScore = createSelector(
    WhatifTopScorerBets,
    WhatifGoalsDataByPlayerId,
    WhatifTopScorersAnswer,
    FormattedSpecialQuestionsScoreConfig,
    (whatifBets, whatifScorersData, whatifTopScorers, scoresConfig) => {
        return valuesOf(whatifBets).map((bet) => {
            const answer = bet.answer.id
            let additionalScore = 0
            const goalsData = whatifScorersData[answer]
            if (goalsData) {
                additionalScore +=
                    goalsData.goals * scoresConfig.topScorer.eachGoal
            }
            if (whatifTopScorers.includes(answer)) {
                additionalScore += scoresConfig.topScorer.correct
            }
            return {
                ...bet,
                score: (bet.score || 0) + additionalScore,
            }
        })
    }
)

export const WhatifTopAssistsBetsWithScore = createSelector(
    WhatifTopAssistsBets,
    WhatifGoalsDataByPlayerId,
    WhatifTopAssistsAnswer,
    FormattedSpecialQuestionsScoreConfig,
    (whatifBets, whatifScorersData, whatifTopAssists, scoresConfig) => {
        return valuesOf(whatifBets).map((bet) => {
            const answer = bet.answer.id
            let additionalScore = 0
            const goalsData = whatifScorersData[answer]
            if (goalsData) {
                additionalScore +=
                    goalsData.assists * scoresConfig.topAssists.eachGoal
            }
            if (whatifTopAssists.includes(answer)) {
                additionalScore += scoresConfig.topAssists.correct
            }
            return {
                ...bet,
                score: (bet.score || 0) + additionalScore,
            }
        })
    }
)

export const WhatifWinnerBetsWithScoreByUtlId = createSelector(
    WhatifWinnerBetsWithScore,
    (whatifBets) => {
        return groupBy(whatifBets, 'user_tournament_id')
    }
)

export const WhatifRunnerUpBetsWithScoreByUtlId = createSelector(
    WhatifRunnerUpBetsWithScore,
    (whatifBets) => {
        return groupBy(whatifBets, 'user_tournament_id')
    }
)

export const WhatifTopScorerBetsWithScoreByUtlId = createSelector(
    WhatifTopScorerBetsWithScore,
    (whatifBets) => {
        return groupBy(whatifBets, 'user_tournament_id')
    }
)

export const WhatifTopAssistsBetsWithScoreByUtlId = createSelector(
    WhatifTopAssistsBetsWithScore,
    (whatifBets) => {
        return groupBy(whatifBets, 'user_tournament_id')
    }
)

export const WhatifAddedScorePerUtlPerGame = createSelector(
    UnfinishedGameBetsWithWhatifData,
    BetsFullScoresConfigSelector,
    (unfinishedGameBets, scoreConfig) => {
        const res = mapValues(unfinishedGameBets, (betsByUtlId) =>
            mapValues(betsByUtlId, (bet) =>
                calcGainedPointsOnGameBet(bet, scoreConfig.gameBets)
            )
        )
        return res
    }
)

export const WhatifFinalGame = createSelector(
    FinalGame,
    WhatifsGamesData,
    (finalGame, whatifGames) => {
        if (!finalGame) {
            return null
        }
        if (!whatifGames[finalGame.id]?.result) {
            return null
        }
        const whatifResult = whatifGames[finalGame.id].result
        const hasResultData =
            typeof whatifResult?.home === 'number' &&
            typeof whatifResult?.away === 'number'
        const hasQualifierData =
            !!whatifResult?.qualifier ||
            (hasResultData &&
                !!getWinnerSide(whatifResult?.home, whatifResult?.away))
        return {
            ...finalGame,
            ...(hasResultData
                ? {
                      result_home: whatifResult.home,
                      result_away: whatifResult.away,
                  }
                : {}),
            ...(hasQualifierData
                ? {
                      winner_side:
                          whatifResult.qualifier ??
                          getWinnerSide(whatifResult.home, whatifResult.away),
                  }
                : {}),
        }
    }
)

export const WhatifSpecialAnswers = createSelector(
    WhatifTopScorersAnswer,
    WhatifTopAssistsAnswer,
    WhatifFinalGame,
    IsFinalGameWhatif,
    PlayersWithTeams,
    WinnerSpecialQuestionId,
    RunnerUpSpecialQuestionId,
    TopScorerSpecialQuestionId,
    TopAssistsSpecialQuestionId,
    (
        topScorerIds,
        topAssistsIds,
        finalGame,
        isFinalWhatif,
        players,
        winnerSpecialQuestionId,
        runnerUpSpecialQuestionId,
        topScorerSpecialQuestionId,
        topAssistsSpecialQuestionId
    ) => {
        const answersByQuestionId: Record<number, SpecialQuestionAnswer[]> = {}

        if (isFinalWhatif) {
            const winnerSide = getQualifierSide(finalGame)
            if (winnerSide === WinnerSide.Home) {
                answersByQuestionId[winnerSpecialQuestionId] = [
                    finalGame.home_team,
                ]
                answersByQuestionId[runnerUpSpecialQuestionId] = [
                    finalGame.away_team,
                ]
            } else if (winnerSide === WinnerSide.Away) {
                answersByQuestionId[winnerSpecialQuestionId] = [
                    finalGame.away_team,
                ]
                answersByQuestionId[runnerUpSpecialQuestionId] = [
                    finalGame.home_team,
                ]
            }
        }

        const topScorers = topScorerIds
            .map((id) => players[id])
            .filter((player) => !!player)
        const topAssists = topAssistsIds
            .map((id) => players[id])
            .filter((player) => !!player)
        if (topScorers.length > 0) {
            answersByQuestionId[topScorerSpecialQuestionId] = topScorers
        }
        if (topAssists.length > 0) {
            answersByQuestionId[topAssistsSpecialQuestionId] = topAssists
        }

        return answersByQuestionId
    }
)

export const WhatifGameBetsWithScore = createSelector(
    UnfinishedGameBetsWithWhatifData,
    WhatifAddedScorePerUtlPerGame,
    (betsByUtlIdByGameId, scoreByUtlIdByGameId) => {
        const res: MatchBetWithRelations[] = []
        for (const [gameId, betsByUtlId] of Object.entries(
            betsByUtlIdByGameId
        )) {
            for (const [utlId, bet] of Object.entries(betsByUtlId)) {
                if (
                    scoreByUtlIdByGameId[gameId] &&
                    scoreByUtlIdByGameId[gameId][utlId]
                ) {
                    res.push({
                        ...bet,
                        score: scoreByUtlIdByGameId[gameId][utlId],
                    })
                }
            }
        }
        return res
    }
)

export const WhatifGameBetsWithRelevantScoreByUtlId = createSelector(
    WhatifGameBetsWithScore,
    (whatifGameBets) => {
        return groupBy(whatifGameBets, 'user_tournament_id')
    }
)


// export const LiveGroupRankBetsWithScore = createSelector(
//     LiveGroupStandingBets,
//     LiveGroupStandings,
//     BetsFullScoresConfigSelector,
//     (liveGroupRankBetsById, liveGroupStandings, scoresConfig) => {
//         return valuesOf(liveGroupRankBetsById).map((bet) => ({
//             ...bet,
//             score: calcGainedPointsOnStandingsBet({
//                 bet: map(bet.standings, 'id'),
//                 answer: liveGroupStandings[bet.relatedGroup.id],
//                 scoreConfig: scoresConfig.groupRankBets,
//             }),
//         }))
//     }
// )

// export const LiveGroupRankBetsWithScoreByUtlId = createSelector(
//     LiveGroupRankBetsWithScore,
//     (liveBets) => {
//         return groupBy(liveBets, 'user_tournament_id')
//     }
// )

// export const LiveGroupRankBetsWithScoreByGroupId = createSelector(
//     LiveGroupRankBetsWithScore,
//     (liveBets) => {
//         return groupBy(liveBets, (bet) => bet.relatedGroup.id)
//     }
// )
