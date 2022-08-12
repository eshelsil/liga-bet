import { groupBy, mapValues, pickBy } from 'lodash';
import { createSelector } from 'reselect'
import { QuestionBetWithRelations } from '../../types';
import { QuestionBets, SpecialQuestions, Contestants } from '../base';


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
    SpecialQuestions,
    (bets, questions) => {
        const betsWithRelatedMatch = mapValues(bets, (bet): QuestionBetWithRelations => ({
            ...bet,
            relatedQuestion: questions[bet.type_id],
        }));
        return pickBy(betsWithRelatedMatch, bet => bet.relatedQuestion);
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
