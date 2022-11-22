import { createSelector } from 'reselect'
import { calcGainedPointsOnGameBet, calcLeaderboardVersionsDiff, formatLeaderboardVersion, generateEmptyScoreboardRow, valuesOf } from '../../utils'
import { calcLiveAddedScore, getLiveVersionScore } from '../../utils'
import { BetsFullScoresConfigSelector, Contestants, GameGoalsDataSelector, LeaderboardVersionsDesc } from '../base'
import { LiveGameBets, QuestionBetsByUtlId } from '../modelRelations'
import { LeaderboardVersion } from '../../types'
import { groupBy, keyBy } from 'lodash'


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
        const latestVersion = Object.keys(versions[0] || {}).length > 0
            ? versions[0]
            : {
                id: 1,
                description: '',
                created_at: new Date(),
                leaderboard: keyBy(valuesOf(contestants).map(generateEmptyScoreboardRow), 'id')
            } as LeaderboardVersion
        const liveGameBetsByUtlId = groupBy(valuesOf(liveGamesBets), 'user_tournament_id')
        const addedScorePerUtl = calcLiveAddedScore({
            betsByUtlId: liveGameBetsByUtlId,
            goalsData,
            questionBetsByUtlId,
            config: scoresConfig,
        })
        const liveVersion = getLiveVersionScore(latestVersion, addedScorePerUtl)
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