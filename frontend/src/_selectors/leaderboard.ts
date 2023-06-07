import { createSelector } from 'reselect'
import { keysOf } from '../utils'
import { IsTournamentStarted } from './base'
import { GamesIncludedInCurrentLeaderboard, GroupStandingsDiscludedByHistoricLeaderboard, IsCurrentLeaderboardMissing, LiveGameBetsWithScoreByUtlId, LiveGroupRankBetsWithScoreByUtlId, LiveRunnerUpBetsWithScoreByUtlId, LiveSpecialAnswers, LiveTopAssistsBetsWithScoreByUtlId, LiveTopScorerBetsWithScoreByUtlId, LiveWinnerBetsWithScoreByUtlId, PrimalBetsScoresOverrideByLeaderboardSettings, ScoreboardSelector, SpecialBetAnswersDiscludedByHistoricLeaderboard } from './logic'
import {
    GroupStandingBetsLinked,
    LiveGroupStandingsWithTeams,
    MatchBetsLinked,
    QuestionBetsLinked,
} from './modelRelations'
import { concat, groupBy, keyBy, mapValues, pickBy } from 'lodash'

export const LeaderboardSelector = createSelector(
    ScoreboardSelector,
    IsCurrentLeaderboardMissing,
    IsTournamentStarted,
    (leaderboard, isCurrentLeaderboardMissing, hasTournamentStarted) => {
        return {
            leaderboard: leaderboard,
            isCurrentLeaderboardMissing,
            hasTournamentStarted,
        }
    }
)

export const ContestantSelector = createSelector(
    MatchBetsLinked,
    GroupStandingBetsLinked,
    QuestionBetsLinked,
    GamesIncludedInCurrentLeaderboard,
    PrimalBetsScoresOverrideByLeaderboardSettings,
    GroupStandingsDiscludedByHistoricLeaderboard,
    SpecialBetAnswersDiscludedByHistoricLeaderboard,
    LiveGameBetsWithScoreByUtlId,
    LiveGroupRankBetsWithScoreByUtlId,
    LiveGroupStandingsWithTeams,
    LiveWinnerBetsWithScoreByUtlId,
    LiveRunnerUpBetsWithScoreByUtlId,
    LiveTopScorerBetsWithScoreByUtlId,
    LiveTopAssistsBetsWithScoreByUtlId,
    LiveSpecialAnswers,
    (
        matchBets,
        groupStandingBets,
        questionBets,
        gamesIncludedInLeaderboard,
        primalBetsScoreOverride,
        groupIdsOverridedAsNotDone,
        specialQuestionIdsOverridedAsNotDone,
        liveGameBetsByUtlId,
        liveGroupRankBetsByUtlId,
        liveStandingsByGroupId,
        liveWinnerBetsByUtlId,
        liveRunnerUpBetsByUtlId,
        liveTopScorerBetsByUtlId,
        liveTopAssistsBetsByUtlId,
        liveSpecialAnswers,
    ) => {
        const gamesIncludedById = keyBy(gamesIncludedInLeaderboard, 'id')
        const relevantMatchBets = pickBy(matchBets, (bet) => bet.score > 0 && !!gamesIncludedById[bet.type_id])
        const matchBetsByUserId = groupBy(
            relevantMatchBets,
            'user_tournament_id'
        )
        const groupStandingBetsByUserId = groupBy(
            mapValues(groupStandingBets, bet => ({
                ...bet,
                relatedGroup: {
                    ...bet.relatedGroup,
                    ...(groupIdsOverridedAsNotDone.includes(bet.relatedGroup.id) ? {
                        isDone: false
                    } : {}),
                },
                score: primalBetsScoreOverride[bet.id] ?? bet.score,
            })),
            'user_tournament_id'
        )
        const questionBetsByUserId = groupBy(
            mapValues(questionBets, bet => ({
                ...bet,
                relatedQuestion: {
                    ...bet.relatedQuestion,
                    ...(specialQuestionIdsOverridedAsNotDone.includes(bet.relatedQuestion.id) ? {
                        answer: []
                    } : {}),
                },
                score: primalBetsScoreOverride[bet.id] ?? bet.score
            })),
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
        for (const utlId of keysOf(liveTopScorerBetsByUtlId) as number[]) {
            if (!liveQuestionBetsByUtlId[utlId]) {
                liveQuestionBetsByUtlId[utlId] = []
            }
            liveQuestionBetsByUtlId[utlId].push(liveTopScorerBetsByUtlId[utlId])
        }
        for (const utlId of keysOf(liveTopAssistsBetsByUtlId) as number[]) {
            if (!liveQuestionBetsByUtlId[utlId]) {
                liveQuestionBetsByUtlId[utlId] = []
            }
            liveQuestionBetsByUtlId[utlId].push(liveTopAssistsBetsByUtlId[utlId])
        }
        return {
            matchBetsByUserId,
            groupStandingBetsByUserId,
            questionBetsByUserId,
            liveGameBetsByUtlId,
            liveGroupRankBetsByUtlId,
            liveStandingsByGroupId,
            liveQuestionBetsByUtlId: mapValues(liveQuestionBetsByUtlId, betsSlices => concat(...betsSlices)),
            liveSpecialAnswers,
        }
    }
)
