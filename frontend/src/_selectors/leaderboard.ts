import { createSelector } from 'reselect'
import { isBetBelongsToSideTournament, keysOf } from '../utils'
import {
    CurrentSideTournamentId,
    CurrentTournament,
    IsSideTournament,
    IsTournamentStarted,
} from './base'
import {
    GamesIncludedInCurrentLeaderboard,
    GroupStandingsDiscludedByHistoricLeaderboard,
    IsCurrentLeaderboardMissing,
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
    WhatifGameBetsWithRelevantScoreByUtlId,
    WhatifRunnerUpBetsWithScoreByUtlId,
    WhatifSpecialAnswers,
    WhatifTopAssistsBetsWithScoreByUtlId,
    WhatifTopScorerBetsWithScoreByUtlId,
    WhatifWinnerBetsWithScoreByUtlId,
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
    WhatifGameBetsWithRelevantScoreByUtlId,
    WhatifWinnerBetsWithScoreByUtlId,
    WhatifRunnerUpBetsWithScoreByUtlId,
    WhatifTopScorerBetsWithScoreByUtlId,
    WhatifTopAssistsBetsWithScoreByUtlId,
    WhatifSpecialAnswers,
    CurrentSideTournamentId,
    CurrentTournament,
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
        whatifGameBetsByUtlId,
        whatifWinnerBetsByUtlId,
        whatifRunnerUpBetsByUtlId,
        whatifTopScorerBetsByUtlId,
        whatifTopAssistsBetsByUtlId,
        whatifSpecialAnswers,
        sideTournamentId,
        currentTournament,
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

        const liveQuestionBetsByUtlId: Record<number, any> = {}
        const whatifQuestionBetsByUtlId: Record<number, any> = {}
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
        for (const utlId of keysOf(whatifWinnerBetsByUtlId) as number[]) {
            if (!whatifQuestionBetsByUtlId[utlId]) {
                whatifQuestionBetsByUtlId[utlId] = []
            }
            whatifQuestionBetsByUtlId[utlId].push(whatifWinnerBetsByUtlId[utlId])
        }
        for (const utlId of keysOf(whatifRunnerUpBetsByUtlId) as number[]) {
            if (!whatifQuestionBetsByUtlId[utlId]) {
                whatifQuestionBetsByUtlId[utlId] = []
            }
            whatifQuestionBetsByUtlId[utlId].push(whatifRunnerUpBetsByUtlId[utlId])
        }
        for (const utlId of keysOf(whatifTopScorerBetsByUtlId) as number[]) {
            if (!whatifQuestionBetsByUtlId[utlId]) {
                whatifQuestionBetsByUtlId[utlId] = []
            }
            whatifQuestionBetsByUtlId[utlId].push(whatifTopScorerBetsByUtlId[utlId])
        }
        for (const utlId of keysOf(whatifTopAssistsBetsByUtlId) as number[]) {
            if (!whatifQuestionBetsByUtlId[utlId]) {
                whatifQuestionBetsByUtlId[utlId] = []
            }
            whatifQuestionBetsByUtlId[utlId].push(
                whatifTopAssistsBetsByUtlId[utlId]
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
            whatifGameBetsByUtlId,
            whatifQuestionBetsByUtlId: mapValues(
                whatifQuestionBetsByUtlId,
                (betsSlices) => concat(...betsSlices)
            ),
            whatifSpecialAnswers,
            isSideTournament: !!sideTournamentId,
        }
    }
)
