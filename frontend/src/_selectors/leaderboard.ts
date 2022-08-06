import { groupBy } from 'lodash';
import { createSelector } from 'reselect'
import { IsTournamentStarted, Leaderboard } from './base';
import { GroupStandingBetsByUserId, MatchBetsWithPositiveScores, QuestionBetsByUserQuestionId } from './modelRelations';


export const LeaderboardSelector = createSelector(
    Leaderboard,
    IsTournamentStarted,
    (leaderboard, hasTournamentStarted) => ({
        leaderboard,
        hasTournamentStarted,
    })
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
