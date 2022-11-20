import { keyBy } from 'lodash'
import { createSelector } from 'reselect'
import { SpecialQuestionType } from '../../types'
import { CurrentTournamentUserId } from '../base'
import {
    GroupStandingBetsByUserId,
    MatchBetsByUserId,
    QuestionBetsByUserQuestionId,
} from '../modelRelations'

export const MyMatchBetsSelector = createSelector(
    MatchBetsByUserId,
    CurrentTournamentUserId,
    (betsByUserId, utlId) => {
        return betsByUserId[utlId] ?? []
    }
)

export const MyGroupStandingsBetsSelector = createSelector(
    GroupStandingBetsByUserId,
    CurrentTournamentUserId,
    (betsByUserId, utlId) => {
        return betsByUserId[utlId] ?? []
    }
)

export const MyQuestionBetsSelector = createSelector(
    QuestionBetsByUserQuestionId,
    CurrentTournamentUserId,
    (betsByUserId, utlId) => {
        return betsByUserId[utlId] ?? []
    }
)

export const MyGroupRankBetsById = createSelector(
    MyGroupStandingsBetsSelector,
    (bets) => {
        return keyBy(bets, 'type_id')
    }
)

export const MyQuestionBetsById = createSelector(
    MyQuestionBetsSelector,
    (bets) => {
        return keyBy(bets, 'type_id')
    }
)

export const MyGameBetsById = createSelector(
    MyMatchBetsSelector,
    (bets) => {
        return keyBy(bets, 'type_id')
    }
)

export const MyWinnerTeamSelector = createSelector(
    MyQuestionBetsSelector,
    (questionBets) => {
        const winnerBet = questionBets.find(bet => bet.relatedQuestion.type === SpecialQuestionType.Winner)
        return winnerBet ? winnerBet.answer : null
    }
)

export const MyTopScorerSelector = createSelector(
    MyQuestionBetsSelector,
    (questionBets) => {
        const topScorerBet = questionBets.find(bet => bet.relatedQuestion.type === SpecialQuestionType.TopScorer)
        return topScorerBet ? topScorerBet.answer : null
    }
)

export const MyTopAssistsSelector = createSelector(
    MyQuestionBetsSelector,
    (questionBets) => {
        const topAssistsBet = questionBets.find(bet => bet.relatedQuestion.type === SpecialQuestionType.TopAssists)
        return topAssistsBet ? topAssistsBet.answer : null
    }
)