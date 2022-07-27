import { createSelector } from 'reselect'
import { Leaderboard } from './base';
import { GroupStandingBetsByUserId, MatchBetsByUserId, QuestionBetsByUserQuestionId } from './modelRelations';


export const LeaderboardSelector = createSelector(
    Leaderboard,
    leaderboard => ({ leaderboard })
);


export const ContestantSelector = createSelector(
    MatchBetsByUserId,
    GroupStandingBetsByUserId,
    QuestionBetsByUserQuestionId,
    (matchBetsByUserId, groupStandingBetsByUserId, questionBetsByUserId) => ({
        matchBetsByUserId,
        groupStandingBetsByUserId,
        questionBetsByUserId,
    })
);
