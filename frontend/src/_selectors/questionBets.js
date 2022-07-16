import { createSelector } from 'reselect'
import { QuestionBets, SpecialQuestions, Users } from './main';

export const ClosedQuestionBetsSelector = createSelector(
    QuestionBets,
    SpecialQuestions,
    (questionBets, specialQuestions) => {
        const betsByQuestionId = _.groupBy(questionBets, bet => bet.relatedQuestion.id);
        return {
            betsByQuestionId,
            questions: specialQuestions,
        };
    }
);