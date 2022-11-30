import { createSelector } from 'reselect'
import { formatLeaderboardVersion, keysOf, valuesOf } from '../utils'
import { Contestants, IsTournamentStarted } from './base'
import { LatestLeaderboard, LiveGameBetsWithScoreByUtlId, LiveGroupRankBetsWithScoreByUtlId, LiveRunnerUpBets, LiveRunnerUpBetsWithScoreByUtlId, LiveWinnerBets, LiveWinnerBetsWithScoreByUtlId } from './logic'
import {
    GroupStandingBetsByUserId,
    LiveGroupStandingsWithTeams,
    MatchBetsWithPositiveScores,
    QuestionBetsByUserQuestionId,
} from './modelRelations'
import { concat, groupBy, mapValues } from 'lodash'

export const LeaderboardSelector = createSelector(
    LatestLeaderboard,
    IsTournamentStarted,
    Contestants,
    (leaderboard, hasTournamentStarted, contestants) => {
        return {
            leaderboard: formatLeaderboardVersion(leaderboard, contestants),
            contestants: valuesOf(contestants),
            hasTournamentStarted,
        }
    }
)

export const ContestantSelector = createSelector(
    MatchBetsWithPositiveScores,
    GroupStandingBetsByUserId,
    QuestionBetsByUserQuestionId,
    LiveGameBetsWithScoreByUtlId,
    LiveGroupRankBetsWithScoreByUtlId,
    LiveGroupStandingsWithTeams,
    LiveWinnerBetsWithScoreByUtlId,
    LiveRunnerUpBetsWithScoreByUtlId,
    (
        relevantMatchBets,
        groupStandingBetsByUserId,
        questionBetsByUserId,
        liveGameBetsByUtlId,
        liveGroupRankBetsByUtlId,
        liveStandingsByGroupId,
        liveWinnerBetsByUtlId,
        liveRunnerUpBetsByUtlId,
    ) => {
        const matchBetsByUserId = groupBy(
            relevantMatchBets,
            'user_tournament_id'
        )
        const liveQuestionBetsByUtlId: Record<number, any> = {}
        for (const utlId of keysOf(liveWinnerBetsByUtlId) as number[]) {
            if (!liveQuestionBetsByUtlId[utlId]) {
                liveQuestionBetsByUtlId[utlId] = []
            }
            liveQuestionBetsByUtlId[utlId].push(liveWinnerBetsByUtlId[utlId])
        }
        for (const utlId of keysOf(liveRunnerUpBetsByUtlId) as number[]) {
            if (!liveQuestionBetsByUtlId[utlId]) {
                liveQuestionBetsByUtlId[utlId] = []
            }
            liveQuestionBetsByUtlId[utlId].push(liveRunnerUpBetsByUtlId[utlId])
        }
        return {
            matchBetsByUserId,
            groupStandingBetsByUserId,
            questionBetsByUserId,
            liveGameBetsByUtlId,
            liveGroupRankBetsByUtlId,
            liveStandingsByGroupId,
            liveQuestionBetsByUtlId: mapValues(liveQuestionBetsByUtlId, betsSlices => concat(...betsSlices)),
        }
    }
)
