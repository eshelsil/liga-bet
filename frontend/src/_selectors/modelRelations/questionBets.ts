import { groupBy, mapValues, pickBy } from 'lodash';
import { createSelector } from 'reselect'
import { QuestionBetWithRelations, SpecialQuestion } from '../../types';
import { specialQuestionToAnswerType } from '../../utils';
import { QuestionBets, Contestants, Teams } from '../base';
import { getSpecialAnswerModel, SpecialQuestionsWithRelations } from './specialQuestion';
import { PlayersWithTeams } from './players';


export const QuestionBetsWithUserNames = createSelector(
    QuestionBets,
    Contestants,
    (bets, users) => {
        return mapValues(bets, bet => ({
            ...bet,
            utlName: users[bet.user_tournament_id]?.name,
        }));
    }
);


export const QuestionBetsLinked = createSelector(
    QuestionBetsWithUserNames,
    SpecialQuestionsWithRelations,
    Teams,
    PlayersWithTeams,
    (bets, questions, teamsById, playersById) => {
        const betsWithRelations = mapValues(bets, (bet): QuestionBetWithRelations => {
            const relatedQuestion = questions[bet.type_id] ?? {} as SpecialQuestion;
            const answerType = specialQuestionToAnswerType[relatedQuestion.type];
            return {
                ...bet,
                relatedQuestion,
                answer: getSpecialAnswerModel(bet.answer, answerType, teamsById, playersById),
            }
        });
        return pickBy(betsWithRelations, bet => (bet.relatedQuestion && bet.answer) );
    }
);

export const QuestionBetsById = createSelector(
    QuestionBetsLinked,
    bets => {
        return groupBy(Object.values(bets), 'type_id');
    }
);

export const QuestionBetsByUserQuestionId = createSelector(
    QuestionBetsLinked,
    bets => {
        return groupBy(Object.values(bets), 'user_tournament_id');
    }
);
