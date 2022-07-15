import { createSelector } from 'reselect'
import { QuestionBets, SpecialQuestions, Users } from './main';

export const ClosedQuestionBetsSelector = createSelector(
    QuestionBets,
    SpecialQuestions,
    Users,
    (questionBets, specialQuestions, users) => {
        console.log({questionBets, specialQuestions, users});
        const betsWithUsersName = questionBets.map(bet => ({
            ...bet,
            user_name: users[bet.user_id]?.name,
        }));
        const betsByQuestionId = _.groupBy(betsWithUsersName, bet => bet.relatedQuestion.id);
        return {
            betsByQuestionId,
            questions: specialQuestions,
        };
    }
);