import { groupBy, orderBy } from 'lodash'
import { createSelector } from 'reselect'
import { ScoreboardRowDetailed } from '../types'
import { Contestants, IsTournamentStarted } from './base'
import { LatestLeaderboard } from './logic/scoreboard'
import {
    GroupStandingBetsByUserId,
    MatchBetsWithPositiveScores,
    QuestionBetsByUserQuestionId,
} from './modelRelations'

export const LeaderboardSelector = createSelector(
    LatestLeaderboard,
    IsTournamentStarted,
    Contestants,
    (leaderboard, hasTournamentStarted, contestants) => {
        const leaderBoardWithNames: ScoreboardRowDetailed[] = Object.values(leaderboard).map(
            (scoreboardRow) => ({
                ...scoreboardRow,
                name: contestants[scoreboardRow.user_tournament_id]?.name ?? '',
            })
        )
        const sortedScoreboard = orderBy(leaderBoardWithNames, 'rank')
        return {
            leaderboard: sortedScoreboard,
            hasTournamentStarted,
        }
    }
)

export const ContestantSelector = createSelector(
    MatchBetsWithPositiveScores,
    GroupStandingBetsByUserId,
    QuestionBetsByUserQuestionId,
    (relevantMatchBets, groupStandingBetsByUserId, questionBetsByUserId) => {
        const matchBetsByUserId = groupBy(
            relevantMatchBets,
            'user_tournament_id'
        )
        return {
            matchBetsByUserId,
            groupStandingBetsByUserId,
            questionBetsByUserId,
        }
    }
)
