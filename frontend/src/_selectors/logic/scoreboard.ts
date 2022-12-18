import { createSelector } from 'reselect'
import { calcGainedPointsOnGameBet, calcGainedPointsOnStandingsBet, calcLeaderboardVersionsDiff, formatLeaderboardVersion, generateEmptyScoreboardRow, keysOf, valuesOf } from '../../utils'
import { calcLiveAddedScore, getLiveVersionScore } from '../../utils'
import { BetsFullScoresConfigSelector, Contestants, LeaderboardVersionsDesc, QuestionBets } from '../base'
import { LiveGameBets, LiveGroupStandingBets, LiveGroupStandings } from '../modelRelations'
import { LeaderboardVersion } from '../../types'
import { groupBy, keyBy, map, mapValues, sumBy } from 'lodash'
import { LiveRunnerUpBetsWithScoreByUtlId, LiveTopAssistsBetsWithScoreByUtlId, LiveTopScorerBetsWithScoreByUtlId, LiveWinnerBetsWithScoreByUtlId } from './liveQuestionBets'


export const LatestLeaderboard = createSelector(
    LeaderboardVersionsDesc,
    (versions) => {
        const latestVersion = versions[0]
        if (!latestVersion) return {}
        const prevVersion = versions[1]
        return calcLeaderboardVersionsDiff(latestVersion, prevVersion)
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
    LeaderboardVersionsDesc,
    LiveGameBets,
    LiveGroupRankBetsWithScoreByUtlId,
    LiveWinnerBetsWithScoreByUtlId,
    LiveRunnerUpBetsWithScoreByUtlId,
    LiveTopScorerBetsWithScoreByUtlId,
    LiveTopAssistsBetsWithScoreByUtlId,
    BetsFullScoresConfigSelector,
    Contestants,
    QuestionBets,
    (
        versions,
        liveGamesBets,
        liveGroupBetsByUtlId,
        liveWinnerBets,
        liveRunnerUpBets,
        liveTopScorers,
        liveTopAssists,
        scoresConfig,
        contestants,
        questionBetsById
    ) => {
        const latestVersion = Object.keys(versions[0] || {}).length > 0
            ? versions[0]
            : {
                id: 1,
                description: '',
                created_at: new Date(),
                leaderboard: keyBy(valuesOf(contestants).map(generateEmptyScoreboardRow), 'id')
            } as LeaderboardVersion
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
            const prevScore = sumBy(bets, bet => questionBetsById[bet.id]?.score ?? 0)
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
        const liveVersion = getLiveVersionScore(latestVersion, addedScorePerUtl)
        return formatLeaderboardVersion(liveVersion, contestants)
    }
)