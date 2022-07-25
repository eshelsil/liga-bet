import { createSelector } from 'reselect'
import { BetTypes } from '../_enums/betTypes';

export const NoSelector = state => ({});

export const CurrentUser = state => state.currentUser ?? {};
export const CurrentTournamentUser = state => state.currentTournamentUser ?? {};
export const Users = state => state.users ?? {};
export const Bets = state => state.bets ?? {};
export const Leaderboard = state => state.leaderboard ?? {};
export const Matches = state => state.matches ?? {};
export const Teams = state => state.teams ?? {};
export const Groups = state => state.groups ?? {};
export const SpecialQuestions = state => state.specialQuestions ?? {};

export const AuthControllerSelector = createSelector(
    CurrentUser,
    currentUser => ({ user: currentUser })
);
export const TournamentUserControllerSelector = createSelector(
    CurrentTournamentUser,
    currentTournamentUser => ({ tournamentUser: currentTournamentUser })
);


export const TournamentIdSelector = createSelector(
    CurrentTournamentUser,
    utl => utl.tournament_id
);

// export const CurentTournamentSelector = createSelector(
//     CurrentTournamentUser,
//     currentTournamentUser => currentTournamentUser.tournament ?? {}
// );
    
// export const CompetitionIdSelector = createSelector(
//     CurentTournamentSelector,
//     currentTournament => currentTournament.competition_id
// );

export const LeaderboardSelector = createSelector(
    Leaderboard,
    leaderboard => ({ leaderboard })
);

export const BetsWithUsersName = createSelector(
    Bets,
    Users,
    (bets, users) => {
        return _.mapValues(bets, bet => ({
            ...bet,
            user_name: users[bet.user_tournament_id]?.name,
        }));
    }
);


export const TeamsByGroupId = createSelector(
    Teams,
    (teams) => {
        return _.groupBy(teams, 'group_id');
    }
);

export const GroupsWithTeams = createSelector(
    Groups,
    TeamsByGroupId,
    (groups, teamsByGroupId) => {
        const groupsWithTemas = _.mapValues(groups, group => ({
            ...group,
            teams: teamsByGroupId[group.id],
        }));
        return _.pickBy(groupsWithTemas, group => group.teams);
    }
);


export const GroupStandingBets = createSelector(
    BetsWithUsersName,
    Groups,
    Teams,
    (bets, groups, teams) => {
        const groupRankBets = _.pickBy(bets, bet => bet.type === BetTypes.GroupsRank);
        const betsWithRelations = _.mapValues(groupRankBets, bet => ({
            ...bet,
            standings: bet.standings?.map(teamId => ({
                ...teams[teamId],
            })),
            relatedGroup: groups[bet.type_id],
        }));
        return _.pickBy(betsWithRelations, bet => bet.relatedGroup);
    }
);

export const MatchBets = createSelector(
    BetsWithUsersName,
    Matches,
    (bets, matches) => {
        const matchBets = _.pickBy(bets, bet => bet.type === BetTypes.Match);
        const betsWithRelatedMatch = _.mapValues(matchBets, bet => ({
            ...bet,
            relatedMatch: matches[bet.type_id],
        }));
        return _.pickBy(betsWithRelatedMatch, bet => bet.relatedMatch);
    }
);

export const QuestionBets = createSelector(
    BetsWithUsersName,
    (bets) => {
        return _.pickBy(bets, bet => bet.type === BetTypes.SpecialBet);
    }
);

export const GroupStandingBetsByGroupId = createSelector(
    GroupStandingBets,
    bets => {
        return _.groupBy(Object.values(bets), 'type_id');
    }
);

export const QuestionBetsByQuestionId = createSelector(
    QuestionBets,
    bets => {
        return _.groupBy(Object.values(bets), 'type_id');
    }
);

export const MatchBetsById = createSelector(
    MatchBets,
    bets => {
        return _.groupBy(Object.values(bets), 'type_id');
    }
);

export const GroupStandingBetsByUserId = createSelector(
    GroupStandingBets,
    bets => {
        return _.groupBy(Object.values(bets), 'user_tournament_id');
    }
);

export const QuestionBetsByUserId = createSelector(
    QuestionBets,
    bets => {
        return _.groupBy(Object.values(bets), 'user_tournament_id');
    }
);

export const MatchBetsByUserId = createSelector(
    MatchBets,
    bets => {
        return _.groupBy(Object.values(bets), 'user_tournament_id');
    }
);

export const BetsByUserByTypeSelector = createSelector(
    BetsWithUsersName,
    bets => {
        const res = {};
        for (const bet of Object.values(bets)){
            const { user_tournament_id, type, id } = bet;
            if (!res[user_tournament_id]){
                res[user_tournament_id] = {};
            }
            const userBets = res[user_tournament_id];
            if (!userBets[type]){
                userBets[type] = [];
            }
            userBets[type].push(bet);
        }
        return res;
    }
);

export const ContestantSelector = createSelector(
    MatchBetsByUserId,
    GroupStandingBetsByUserId,
    QuestionBetsByUserId,
    (matchBetsByUserId, groupStandingBetsByUserId, questionBetsByUserId) => ({
        matchBetsByUserId,
        groupStandingBetsByUserId,
        questionBetsByUserId,
    })
);
