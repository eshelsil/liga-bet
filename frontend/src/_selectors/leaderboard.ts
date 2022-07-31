import { groupBy } from 'lodash';
import { createSelector } from 'reselect'
import { Leaderboard } from './base';
import { GroupStandingBetsByUserId, MatchBetsWithPositiveScores, QuestionBetsByUserQuestionId } from './modelRelations';


export const LeaderboardSelector = createSelector(
    Leaderboard,
    leaderboard => ({ leaderboard })
);


export const ContestantSelector = createSelector(
    MatchBetsWithPositiveScores,
    GroupStandingBetsByUserId,
    QuestionBetsByUserQuestionId,
    (relevantMatchBets, groupStandingBetsByUserId, questionBetsByUserId) => {
        const matchBetsByUserId = groupBy(relevantMatchBets, 'user_tournament_id');
        return {
            matchBetsByUserId,
            groupStandingBetsByUserId,
            questionBetsByUserId,
        };
    }
);
