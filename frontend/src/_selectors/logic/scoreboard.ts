import { createSelector } from 'reselect'
import { calcLeaderboardVersionsDiff, formatLeaderboardVersion, generateEmptyScoreboardRow, isGameLive, valuesOf } from '../../utils'
import { calcLiveAddedScore, getLiveVersionScore } from '../../utils'
import { BetsFullScoresConfigSelector, Contestants, GameGoalsDataSelector, LeaderboardVersionsDesc } from '../base'
import { MatchBetsLinked, QuestionBetsByUtlId } from '../modelRelations'
import { groupBy, pickBy } from 'lodash'


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
    MatchBetsLinked,
    BetsFullScoresConfigSelector,
    GameGoalsDataSelector,
    QuestionBetsByUtlId,
    Contestants,
    (versions, matchBets, scoresConfig, goalsData, questionBetsByUtlId, contestants) => {
        const latestVersion = versions[0]
        const liveGamesWithBets = pickBy(matchBets, (bet => isGameLive(bet.relatedMatch)))
        const matchBetsByUtlId = groupBy(valuesOf(liveGamesWithBets), 'user_tournament_id')
        const addedScorePerUtl = calcLiveAddedScore({
            betsByUtlId: matchBetsByUtlId,
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