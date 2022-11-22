import { createSelector } from 'reselect'
import { calcGainedPointsOnGameBet, calcLeaderboardVersionsDiff, formatLeaderboardVersion, generateEmptyScoreboardRow, valuesOf } from '../../utils'
import { calcLiveAddedScore, getLiveVersionScore } from '../../utils'
import { BetsFullScoresConfigSelector, Contestants, GameGoalsDataSelector, LeaderboardVersionsDesc } from '../base'
import { LiveGameBets, QuestionBetsByUtlId } from '../modelRelations'
import { groupBy } from 'lodash'


export const LatestLeaderboard = createSelector(
    LeaderboardVersionsDesc,
    (versions) => {
        const latestVersion = versions[0]
        if (!latestVersion) return {}
        const prevVersion = versions[1]
        return calcLeaderboardVersionsDiff(latestVersion, prevVersion)
    }
)

export const LiveScoreboard = createSelector(
    LeaderboardVersionsDesc,
    LiveGameBets,
    BetsFullScoresConfigSelector,
    GameGoalsDataSelector,
    QuestionBetsByUtlId,
    Contestants,
    (versions, liveGamesBets, scoresConfig, goalsData, questionBetsByUtlId, contestants) => {
        const latestVersion = versions[0]
        const liveGameBetsByUtlId = groupBy(valuesOf(liveGamesBets), 'user_tournament_id')
        const addedScorePerUtl = calcLiveAddedScore({
            betsByUtlId: liveGameBetsByUtlId,
            goalsData,
            questionBetsByUtlId,
            config: scoresConfig,
        })
        const liveVersion = getLiveVersionScore(latestVersion, addedScorePerUtl)
        if (Object.keys(liveVersion).length === 0){
            return valuesOf(contestants).map(generateEmptyScoreboardRow)
        }
        return formatLeaderboardVersion(liveVersion, contestants)
    }
)

export const LiveGameBetsWithScore = createSelector(
    LiveGameBets,
    BetsFullScoresConfigSelector,
    (liveGameBetsById, scoresConfig) => {
        return valuesOf(liveGameBetsById).map(
            gameBet => ({
                ...gameBet,
                score: calcGainedPointsOnGameBet(gameBet, scoresConfig.gameBets.groupStage)
                // TODO: handle on KO
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