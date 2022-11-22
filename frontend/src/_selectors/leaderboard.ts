import { createSelector } from 'reselect'
import { formatLeaderboardVersion, valuesOf } from '../utils'
import { Contestants, IsTournamentStarted } from './base'
import { LatestLeaderboard, LiveGameBetsWithScore, LiveGameBetsWithScoreByUtlId } from './logic'
import {
    GroupStandingBetsByUserId,
    MatchBetsWithPositiveScores,
    QuestionBetsByUserQuestionId,
} from './modelRelations'
import { groupBy } from 'lodash'

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
    (relevantMatchBets, groupStandingBetsByUserId, questionBetsByUserId, liveGameBetsByUtlId) => {
        const matchBetsByUserId = groupBy(
            relevantMatchBets,
            'user_tournament_id'
        )
        return {
            matchBetsByUserId,
            groupStandingBetsByUserId,
            questionBetsByUserId,
            liveGameBetsByUtlId,
        }
    }
)
