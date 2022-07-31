import { groupBy } from 'lodash';
import { createSelector } from 'reselect'
import { SpecialQuestions } from './base';
import { QuestionBetsLinked } from './modelRelations';

export const ClosedQuestionBetsSelector = createSelector(
    QuestionBetsLinked,
    SpecialQuestions,
    (questionBets, specialQuestions) => {
        const betsByQuestionId = groupBy(questionBets, bet => bet.relatedQuestion.id);
        return {
            betsByQuestionId,
            questions: specialQuestions,
        };
    }
);