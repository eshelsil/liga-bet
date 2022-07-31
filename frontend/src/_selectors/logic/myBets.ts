import { keyBy } from 'lodash';
import { createSelector } from 'reselect'
import { CurrentTournamentUser } from '../base';
import { GroupStandingBetsByUserId, MatchBetsByUserId, QuestionBetsByUserQuestionId } from '../modelRelations';

export const MyMatchBetsSelector = createSelector(
    MatchBetsByUserId,
    CurrentTournamentUser,
    (betsByUserId, tournamentUser) => {
        const { id: userId } = tournamentUser;
        return betsByUserId[userId] ?? [];
    }
);

export const MyGroupStandingsBetsSelector = createSelector(
    GroupStandingBetsByUserId,
    CurrentTournamentUser,
    (betsByUserId, tournamentUser) => {
        const { id: userId } = tournamentUser;
        return betsByUserId[userId] ?? [];
    }
);

export const MyQuestionBetsSelector = createSelector(
    QuestionBetsByUserQuestionId,
    CurrentTournamentUser,
    (betsByUserId, tournamentUser) => {
        const { id: userId } = tournamentUser;
        return betsByUserId[userId] ?? [];
    }
);

export const MyGroupRankBetsById = createSelector(
    MyGroupStandingsBetsSelector,
    (bets) => {
        return keyBy(bets, 'type_id');
    }
);