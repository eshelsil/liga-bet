import { createSelector } from 'reselect'
import { calcLiveAddedScore, getLiveVersionScore, calcGainedPointsOnGameBet, calcGainedPointsOnStandingsBet, calcLeaderboardDiff, formatLeaderboardVersion, generateEmptyScoreboardRow, getLatestScoreboard, keysOf, valuesOf, isFinalGame } from '../../utils'
import { ScoreboardRowById, SpecialQuestionType } from '../../types'
import { BetsFullScoresConfigSelector, Contestants, CurrentTournamentUserId, IsShowingHistoricScoreboard, LeaderboardRows, LeaderboardVersions, LeaderboardVersionsDesc, QuestionBets, ScoreboardSettings } from '../base'
import { LiveGameBets, LiveGroupStandingBets, LiveGroupStandings, MatchesWithTeams, SpecialQuestionsWithRelations } from '../modelRelations'
import { LiveRunnerUpBetsWithScoreByUtlId, LiveTopAssistsBetsWithScoreByUtlId, LiveTopScorerBetsWithScoreByUtlId, LiveWinnerBetsWithScoreByUtlId } from './liveQuestionBets'
import { filter, groupBy, isEmpty, keyBy, map, mapValues, sumBy, union } from 'lodash'


export const LatestLeaderboardVersion = createSelector(
    LeaderboardVersionsDesc,
    (versions) => {
        return versions[0]
    }
)

export const LatestLeaderboard = createSelector(
    LeaderboardVersionsDesc,
    LeaderboardRows,
    (versions, leaderboardRows) => {
        return getLatestScoreboard(versions, leaderboardRows)
    }    
)    

export const LiveGameBetsWithScore = createSelector(
    LiveGameBets,
    BetsFullScoresConfigSelector,
    (liveGameBetsById, scoresConfig) => {
        return valuesOf(liveGameBetsById).map(
            gameBet => ({
                ...gameBet,
                score: calcGainedPointsOnGameBet(gameBet, scoresConfig.gameBets)
            })
        )
    }
)

export const LiveGameBetsWithScoreByUtlId = createSelector(
    LiveGameBetsWithScore,
    (liveGameBets) => {
        return groupBy(liveGameBets, 'user_tournament_id')
    }
)

export const LiveGameBetsWithScoreByGameId = createSelector(
    LiveGameBetsWithScore,
    (liveGameBets) => {
        return groupBy(liveGameBets, bet => bet.relatedMatch.id)
    }
)

export const LiveGroupRankBetsWithScore = createSelector(
    LiveGroupStandingBets,
    LiveGroupStandings,
    BetsFullScoresConfigSelector,
    (liveGroupRankBetsById, liveGroupStandings, scoresConfig) => {
        return valuesOf(liveGroupRankBetsById).map(
            bet => ({
                ...bet,
                score: calcGainedPointsOnStandingsBet({
                    bet: map(bet.standings, 'id'),
                    answer: liveGroupStandings[bet.relatedGroup.id],
                    scoreConfig: scoresConfig.groupRankBets,
                })
            })
        )
    }
)

export const LiveGroupRankBetsWithScoreByUtlId = createSelector(
    LiveGroupRankBetsWithScore,
    (liveBets) => {
        return groupBy(liveBets, 'user_tournament_id')
    }
)

export const LiveGroupRankBetsWithScoreByGroupId = createSelector(
    LiveGroupRankBetsWithScore,
    (liveBets) => {
        return groupBy(liveBets, bet => bet.relatedGroup.id)
    }
)



export const LiveScoreboard = createSelector(
    LatestLeaderboard,
    LiveGameBets,
    LiveGroupRankBetsWithScoreByUtlId,
    LiveWinnerBetsWithScoreByUtlId,
    LiveRunnerUpBetsWithScoreByUtlId,
    LiveTopScorerBetsWithScoreByUtlId,
    LiveTopAssistsBetsWithScoreByUtlId,
    BetsFullScoresConfigSelector,
    QuestionBets,
    (
        latestLeaderboard,
        liveGamesBets,
        liveGroupBetsByUtlId,
        liveWinnerBets,
        liveRunnerUpBets,
        liveTopScorers,
        liveTopAssists,
        scoresConfig,
        questionBetsById
    ) => {
        const liveGameBetsByUtlId = groupBy(valuesOf(liveGamesBets), 'user_tournament_id')
        const addedScoreForGamePerUtl = calcLiveAddedScore({
            betsByUtlId: liveGameBetsByUtlId,
            config: scoresConfig,
        })
        const addedScoreForGroupRankPerUtl: Record<number, number> = mapValues(liveGroupBetsByUtlId, bets => sumBy(bets, 'score'))
        const addedScoreForWinnerBetPerUtl: Record<number, number> = mapValues(liveWinnerBets, bets => {
            const currentScore = sumBy(bets, 'score')
            const prevScore = sumBy(bets, bet => questionBetsById[bet.id]?.score ?? 0)
            return currentScore - prevScore
        })
        const addedScoreForRunnerUpBetPerUtl: Record<number, number> = mapValues(liveRunnerUpBets, bets => {
            const currentScore = sumBy(bets, 'score')
            const prevScore = sumBy(bets, bet => questionBetsById[bet.id]?.score ?? 0)
            return currentScore - prevScore
        })
        const addedScoreForTopScorerBetPerUtl: Record<number, number> = mapValues(liveTopScorers, bets => {
            const currentScore = sumBy(bets, 'score')
            const prevScore = sumBy(bets, (bet) => questionBetsById[bet.id]?.score ?? 0)
            return currentScore - prevScore
        })
        const addedScoreForTopAssistsBetPerUtl: Record<number, number> = mapValues(liveTopAssists, bets => {
            const currentScore = sumBy(bets, 'score')
            const prevScore = sumBy(bets, bet => questionBetsById[bet.id]?.score ?? 0)
            return currentScore - prevScore
        })
        const addedScorePerUtl: Record<number, number> = {}
        for (const utlId of keysOf(addedScoreForGamePerUtl)){
            if (!addedScorePerUtl[utlId]){
                addedScorePerUtl[utlId] = 0
            }
            addedScorePerUtl[utlId] += addedScoreForGamePerUtl[utlId] ?? 0
        }
        for (const utlId of keysOf(addedScoreForGroupRankPerUtl) ){
            if (!addedScorePerUtl[utlId]){
                addedScorePerUtl[utlId] = 0
            }
            addedScorePerUtl[utlId] += addedScoreForGroupRankPerUtl[utlId] ?? 0
        }
        for (const utlId of keysOf(addedScoreForWinnerBetPerUtl) ){
            if (!addedScorePerUtl[utlId]){
                addedScorePerUtl[utlId] = 0
            }
            addedScorePerUtl[utlId] += addedScoreForWinnerBetPerUtl[utlId] ?? 0
        }
        for (const utlId of keysOf(addedScoreForRunnerUpBetPerUtl) ){
            if (!addedScorePerUtl[utlId]){
                addedScorePerUtl[utlId] = 0
            }
            addedScorePerUtl[utlId] += addedScoreForRunnerUpBetPerUtl[utlId] ?? 0
        }
        for (const utlId of keysOf(addedScoreForTopScorerBetPerUtl) ){
            if (!addedScorePerUtl[utlId]){
                addedScorePerUtl[utlId] = 0
            }
            addedScorePerUtl[utlId] += addedScoreForTopScorerBetPerUtl[utlId] ?? 0
        }
        for (const utlId of keysOf(addedScoreForTopAssistsBetPerUtl) ){
            if (!addedScorePerUtl[utlId]){
                addedScorePerUtl[utlId] = 0
            }
            addedScorePerUtl[utlId] += addedScoreForTopAssistsBetPerUtl[utlId] ?? 0
        }
        return getLiveVersionScore(latestLeaderboard, addedScorePerUtl)
    }
)


export const CurrentLeaderboard = createSelector(
    ScoreboardSettings,
    LatestLeaderboard,
    LeaderboardRows,
    LiveScoreboard,
    (settings, latestLeaderboard, leaderboardsByVersionId, liveLeaderboard): ScoreboardRowById => {
        if (settings.liveMode){
            return liveLeaderboard
        }
        if (settings.upToDateMode){
            return latestLeaderboard
        }
        return leaderboardsByVersionId[settings.destinationVersion?.id] ?? {}
    }
)

export const IsCurrentLeaderboardMissing = createSelector(
    CurrentLeaderboard,
    LeaderboardVersions,
    (currentLeaderboard, leaderboardVersions): boolean => {
        return isEmpty(currentLeaderboard) && leaderboardVersions.length > 0
    }
)


export const OriginLeaderboard = createSelector(
    ScoreboardSettings,
    LatestLeaderboard,
    LeaderboardRows,
    (settings, latestLeaderboard, leaderboardsByVersionId): ScoreboardRowById => {
        if (settings.liveMode){
            return latestLeaderboard
        }
        if (settings.showChange){
            return leaderboardsByVersionId[settings.originVersion?.id] ?? {}
        }
        return {}
    }
)


export const ScoreboardSelector = createSelector(
    CurrentLeaderboard,
    OriginLeaderboard,
    Contestants,
    (currentLeaderboard, oldLeaderboard, contestants) => {
        const leaderboard = Object.values(calcLeaderboardDiff(currentLeaderboard, oldLeaderboard))
        if (leaderboard.length === 0) {
            return valuesOf(contestants).map(generateEmptyScoreboardRow)
        }
        return formatLeaderboardVersion(leaderboard, contestants)
    }
)


export const CurrentUtlRank = createSelector(
    CurrentTournamentUserId,
    ScoreboardSelector,
    (currentUtlId, leaderboardRows) => {
        return leaderboardRows.find(row => row.user_tournament_id == currentUtlId)?.rank
    }
)


export const GamesOrderedByLeaderboardVersion = createSelector(
    MatchesWithTeams,
    LeaderboardVersions,
    (
        gamesById,
        leaderboardVersions,
    ) => {
        return filter(map(leaderboardVersions, version => gamesById[version.gameId]))
    }
)

export const GamesIncludedInCurrentLeaderboard = createSelector(
    GamesOrderedByLeaderboardVersion,
    IsShowingHistoricScoreboard,
    ScoreboardSettings,
    (
        gamesOrdered,
        isHistoryTable,
        scoreboardSettings,
    ) => {
        if (!isHistoryTable){
            return gamesOrdered
        }
        const { destinationVersion } = scoreboardSettings
        const index = gamesOrdered.findIndex(game => game.id === destinationVersion.gameId)
        return gamesOrdered.slice(index)
    }
)

export const GamesDiscludedInCurrentLeaderboard = createSelector(
    GamesOrderedByLeaderboardVersion,
    GamesIncludedInCurrentLeaderboard,
    (
        games,
        gamesIncluded,
    ) => {
        const gamesIncludedById = keyBy(gamesIncluded, 'id')
        return games.filter(game => !gamesIncludedById[game.id])
    }
)

export const GroupStandingsDiscludedByHistoricLeaderboard = createSelector(
    GamesDiscludedInCurrentLeaderboard,
    IsShowingHistoricScoreboard,
    (
        gamesDiscluded,
        isHistoryTable,
    ) => {
        if (!isHistoryTable){
            return []
        }
        return union(filter(gamesDiscluded.map(game => game.group?.id)))
    }
)

export const IsFinalGameDiscludedByHistoricLeaderboard = createSelector(
    GamesDiscludedInCurrentLeaderboard,
    IsShowingHistoricScoreboard,
    (
        gamesDiscluded,
        isHistoryTable,
    ) => {
        if (!isHistoryTable){
            return false
        }
        return !!gamesDiscluded.find(game => isFinalGame(game))
    }
)

export const SpecialBetAnswersDiscludedByHistoricLeaderboard = createSelector(
    IsShowingHistoricScoreboard,
    SpecialQuestionsWithRelations,
    GroupStandingsDiscludedByHistoricLeaderboard,
    IsFinalGameDiscludedByHistoricLeaderboard,
    (
        isHistoryTable,
        specialQuestionsById,
        groupIdsOverridedAsNotDone,
        isFinalGameDiscluded,
    ) => {
        if (!isHistoryTable){
            return []
        }
        const considerGroupStageUnfinished = groupIdsOverridedAsNotDone.length > 0
        return map(
            valuesOf(specialQuestionsById).filter(specialQuestion => {
                if ([
                    SpecialQuestionType.Winner,
                    SpecialQuestionType.RunnerUp,
                    SpecialQuestionType.TopScorer,
                    SpecialQuestionType.TopAssists,
                    SpecialQuestionType.MVP,
                ].includes(specialQuestion.type)){
                    return isFinalGameDiscluded
                } else if ([
                    SpecialQuestionType.OffensiveTeamGroupStage,
                    SpecialQuestionType.DefensiveTeamGroupStage,
                ].includes(specialQuestion.type)) {
                    return considerGroupStageUnfinished
                }
                return true
            }),
            'id'
        )
    }
)

export const PrimalBetsScoresOverrideByLeaderboardSettings = createSelector(
    IsShowingHistoricScoreboard,
    CurrentLeaderboard,
    (
        isShowingHistoricState,
        leaderboardRows,
    ) => {
        if (!isShowingHistoricState){
            return {}
        }
        const primalBetsScoreOverride = {} as Record<number, number>
        for (const leaderboardRow of valuesOf(leaderboardRows)){
            Object.assign(primalBetsScoreOverride, leaderboardRow.betScoreOverride)
        }
        return primalBetsScoreOverride
    }
)
