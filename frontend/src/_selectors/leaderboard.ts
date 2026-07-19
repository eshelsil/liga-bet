import { createSelector } from 'reselect'
import { isBetBelongsToSideTournament, keysOf } from '../utils'
import {
    CurrentSideTournamentId,
    CurrentTournament,
    IsCurrentTournamentKnockoutBracket,
    IsSideTournament,
    IsTournamentStarted,
} from './base'
import {
    GamesIncludedInCurrentLeaderboard,
    GroupStandingsDiscludedByHistoricLeaderboard,
    IsCurrentLeaderboardMissing,
    LiveBracketQuestionBetsByUtlId,
    LiveGameBetsWithRelevantScoreByUtlId,
    LiveGroupRankBetsWithScoreByUtlId,
    LiveRunnerUpBetsWithScoreByUtlId,
    LiveSpecialAnswers,
    LiveTopAssistsBetsWithScoreByUtlId,
    LiveTopScorerBetsWithScoreByUtlId,
    LiveWinnerBetsWithScoreByUtlId,
    PrimalBetsScoresOverrideByLeaderboardSettings,
    ScoreboardSelector,
    SpecialBetAnswersDiscludedByHistoricLeaderboard,
} from './logic'
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
    IsSideTournament,
    (
        leaderboard,
        isCurrentLeaderboardMissing,
        hasTournamentStarted,
        isSideTournament
    ) => {
        return {
            leaderboard: leaderboard,
            isCurrentLeaderboardMissing,
            hasTournamentStarted,
            isSideTournament,
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
    LiveGameBetsWithRelevantScoreByUtlId,
    LiveGroupRankBetsWithScoreByUtlId,
    LiveGroupStandingsWithTeams,
    LiveWinnerBetsWithScoreByUtlId,
    LiveRunnerUpBetsWithScoreByUtlId,
    LiveTopScorerBetsWithScoreByUtlId,
    LiveTopAssistsBetsWithScoreByUtlId,
    LiveSpecialAnswers,
    CurrentSideTournamentId,
    CurrentTournament,
    IsCurrentTournamentKnockoutBracket,
    LiveBracketQuestionBetsByUtlId,
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
        sideTournamentId,
        currentTournament,
        isKnockoutBracket,
        liveBracketQuestionBetsByUtlId,
    ) => {
        const gamesIncludedById = keyBy(gamesIncludedInLeaderboard, 'id')
        const relevantMatchBets = pickBy(
            matchBets,
            (bet) =>
                bet.score > 0 &&
                !!gamesIncludedById[bet.type_id] &&
                isBetBelongsToSideTournament(
                    bet,
                    currentTournament,
                    sideTournamentId
                )
        )
        const matchBetsByUserId = groupBy(
            relevantMatchBets,
            'user_tournament_id'
        )
        const groupStandingBetsByUserId = groupBy(
            mapValues(groupStandingBets, (bet) => ({
                ...bet,
                relatedGroup: {
                    ...bet.relatedGroup,
                    ...(groupIdsOverridedAsNotDone.includes(bet.relatedGroup.id)
                        ? {
                              isDone: false,
                          }
                        : {}),
                },
                score: primalBetsScoreOverride[bet.id] ?? bet.score,
            })),
            'user_tournament_id'
        )
        const questionBetsByUserId = groupBy(
            mapValues(questionBets, (bet) => ({
                ...bet,
                relatedQuestion: {
                    ...bet.relatedQuestion,
                    ...(specialQuestionIdsOverridedAsNotDone.includes(
                        bet.relatedQuestion.id
                    )
                        ? {
                              answer: [],
                          }
                        : {}),
                },
                score: primalBetsScoreOverride[bet.id] ?? bet.score,
            })),
            'user_tournament_id'
        )

        // Knockout bracket scores its Winner/Runner-Up special bets from the bracket
        // specialAdvance config (not the classic specialBets config, which is empty),
        // so use the bracket-aware live question bets directly.
        if (isKnockoutBracket) {
            return {
                matchBetsByUserId,
                groupStandingBetsByUserId,
                questionBetsByUserId,
                liveGameBetsByUtlId,
                liveGroupRankBetsByUtlId,
                liveStandingsByGroupId,
                liveQuestionBetsByUtlId: liveBracketQuestionBetsByUtlId,
                liveSpecialAnswers,
                isSideTournament: !!sideTournamentId,
            }
        }

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
            liveQuestionBetsByUtlId[utlId].push(
                liveTopAssistsBetsByUtlId[utlId]
            )
        }
        return {
            matchBetsByUserId,
            groupStandingBetsByUserId,
            questionBetsByUserId,
            liveGameBetsByUtlId,
            liveGroupRankBetsByUtlId,
            liveStandingsByGroupId,
            liveQuestionBetsByUtlId: mapValues(
                liveQuestionBetsByUtlId,
                (betsSlices) => concat(...betsSlices)
            ),
            liveSpecialAnswers,
            isSideTournament: !!sideTournamentId,
        }
    }
)
