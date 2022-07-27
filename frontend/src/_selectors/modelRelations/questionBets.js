import { createSelector } from 'reselect'
import { QuestionBets, Users } from '../base';


export const QuestionBetsWithUserNames = createSelector(
    QuestionBets,
    Users,
    (bets, users) => {
        return _.mapValues(bets, bet => ({
            ...bet,
            user_name: users[bet.user_tournament_id]?.name,
        }));
    }
);


export const QuestionBetsLinked = createSelector(
    QuestionBetsWithUserNames,
    ()=>({}), // Questions,
    (bets, questions) => {
        const betsWithRelatedMatch = _.mapValues(bets, bet => ({
            ...bet,
            relatedQuestion: questions[bet.type_id],
        }));
        return _.pickBy(betsWithRelatedMatch, bet => bet.relatedQuestion);
    }
);

export const QuestionBetsById = createSelector(
    QuestionBetsLinked,
    bets => {
        return _.groupBy(Object.values(bets), 'type_id');
    }
);

export const QuestionBetsByUserQuestionId = createSelector(
    QuestionBetsLinked,
    bets => {
        return _.groupBy(Object.values(bets), 'user_tournament_id');
    }
);
