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

export const MyWinnerTeamSelector = createSelector(
    MyQuestionBetsSelector,
    (questionBets) => {
        const winnerBet = questionBets.find(bet => bet.relatedQuestion.type === SpecialQuestionType.Winner)
        return winnerBet ? winnerBet.answer : null
    }
)
