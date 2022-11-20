import { groupBy } from 'lodash'
import { createSelector } from 'reselect'
import { SpecialQuestionWithABet } from '../types'
import { IsTournamentStarted } from './base'
import { CompetitionStartTime, MyQuestionBetsById } from './logic'
import { QuestionBetsLinked } from './modelRelations'
import { SpecialQuestionsWithRelations } from './modelRelations'

export const ClosedQuestionBetsSelector = createSelector(
    QuestionBetsLinked,
    SpecialQuestionsWithRelations,
    (questionBets, specialQuestions) => {
        const betsByQuestionId = groupBy(
            questionBets,
            (bet) => bet.relatedQuestion.id
        )
        return {
            betsByQuestionId,
            questions: specialQuestions,
        }
    }
)

export const OpenQuestionBetsSelector = createSelector(
    MyQuestionBetsById,
    SpecialQuestionsWithRelations,
    CompetitionStartTime,
    IsTournamentStarted,
    (myQuestionBets, specialQuestions, competitionStartTime, isTournamentStarted) => {
        const questionsWithBet = Object.values(specialQuestions).map(
            (question): SpecialQuestionWithABet => ({
                ...question,
                bet: myQuestionBets[question.id],
            })
        )
        return { questionsWithBet, isTournamentStarted, competitionStartTime }
    }
)
