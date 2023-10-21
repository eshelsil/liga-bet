import { createSelector } from 'reselect'
import { RootState } from '../../_helpers/store'
import { pickBy, groupBy, mapValues, sum, keyBy } from 'lodash'
import {
    BetType,
    GroupRankBetApiModel,
    MatchBetApiModel,
    QuestionBetApiModel,
    SideTournament,
    Tournament,
    UtlRole,
} from '../../types'
import { generateDefaultScoreboardSettings, generateEmptyFetcherSlice, generateEmptyGameBetFetcher, valuesOf } from '../../utils'

export const CurrentUser = (state: RootState) => state.currentUser
export const CurrentTournamentUserId = (state: RootState) =>
    state.currentTournamentUser.id
export const ContestantsState = (state: RootState) => state.contestants
export const TournamentUTLs = (state: RootState) => state.tournamentUTLs
export const MyUtls = (state: RootState) => state.myUtls
export const BetsState = (state: RootState) => state.bets
export const LeaderboardVersionsState = (state: RootState) =>
    state.leaderboardVersions
export const LeaderboardRowsState = (state: RootState) => state.leaderboardRows
export const TeamsState = (state: RootState) => state.teams
export const GamesState = (state: RootState) => state.matches
export const PlayersState = (state: RootState) => state.players
export const GroupsState = (state: RootState) => state.groups
export const SpecialQuestionsState = (state: RootState) => state.specialQuestions
export const OwnedTournaments = (state: RootState) => state.ownedTournaments
export const Competitions = (state: RootState) => state.competitions
export const Users = (state: RootState) => state.users
export const UsersTotalCount = (state: RootState) => state.usersTotalCount
export const Dialogs = (state: RootState) => state.dialogs
export const DataFetcher = (state: RootState) => state.dataFetcher
export const GameBetsFetcherState = (state: RootState) => state.gameBetsFetcher
export const LeaderboardsFetcherState = (state: RootState) => state.leaderboardsFetcher
export const AppCrucialLoaders = (state: RootState) => state.appCrucialLoaders
export const NotificationsState = (state: RootState) => state.notifications
export const MultiBetsSettings = (state: RootState) => state.multiBetsSettings
export const ScoreboardSettingsState = (state: RootState) => state.scoreboardSettings
export const AdminData = (state: RootState) => state.admin
export const GameGoalsDataState = (state: RootState) => state.goalsData
export const SelectedSideTournamentId = (state: RootState) => state.selectedSideTournamentId



export const AllTournamentsData = createSelector(
    AdminData,
    ({allTournaments}) => allTournaments
)

export const Notifications = createSelector(
    NotificationsState,
    (notifictionsState) => mapValues(
        notifictionsState,
        tournamentNotifications => sum(valuesOf(tournamentNotifications).map(
            notifications => notifications.length
        ))
    )
)


export const CurrentTournamentUser = createSelector(
    CurrentTournamentUserId,
    MyUtls,
    (utlId, utls) => {
        return utls[utlId]
    }
)

export const CurrentUtlName = createSelector(
    CurrentTournamentUser,
    (utl) => {
        return utl?.name
    }
)

export const HasCurrentUtl = createSelector(
    CurrentTournamentUser,
    (utl) => !!utl
)

export const CurrentTournament = createSelector(
    CurrentTournamentUser,
    (utl) => {
        return utl?.tournament ?? ({} as Tournament)
    }
)

export const CurrentSideTournament = createSelector(
    CurrentTournament,
    SelectedSideTournamentId,
    (tournament, sideTournamentId): SideTournament => {
        return tournament.sideTournaments.find(st => st.id === sideTournamentId) ?? {} as SideTournament
    }
)

export const CurrentSideTournamentId = createSelector(
    CurrentSideTournament,
    (sideTournament) => sideTournament.id ?? null
)

export const IsSideTournament = createSelector(
    CurrentSideTournamentId,
    (sideTournamentId) => !!sideTournamentId
)

export const CurrentTournamentId = createSelector(
    CurrentTournament,
    (tournament) => tournament.id
)

export const CurrentTournamentName = createSelector(
    CurrentTournament,
    (tournament) => tournament.name
)

export const CurrentCompetitionId = createSelector(
    CurrentTournament,
    (tournament) => {
        return tournament.competitionId
    }
)

export const Teams = createSelector(
    TeamsState,
    CurrentCompetitionId,
    (teams, competitionId) => {
        return teams[competitionId] ?? {}
    }
)

export const Players = createSelector(
    PlayersState,
    CurrentCompetitionId,
    (players, competitionId) => {
        return players[competitionId] ?? {}
    }
)

export const Games = createSelector(
    GamesState,
    CurrentCompetitionId,
    (games, competitionId) => {
        return games[competitionId] ?? {}
    }
)

export const GameGoalsDataSelector = createSelector(
    GameGoalsDataState,
    CurrentCompetitionId,
    (gamesGoalsData, competitionId) => {
        return gamesGoalsData[competitionId] ?? {}
    }
)

export const Groups = createSelector(
    GroupsState,
    CurrentCompetitionId,
    (groups, competitionId) => {
        return groups[competitionId] ?? {}
    }
)

export const Contestants = createSelector(
    ContestantsState,
    CurrentTournamentId,
    (contestants, tournamentId) => {
        return contestants[tournamentId] ?? {}
    }
)

export const SpecialQuestions = createSelector(
    SpecialQuestionsState,
    CurrentTournamentId,
    (questions, tournamentId) => {
        return questions[tournamentId] ?? {}
    }
)

export const ScoreboardSettings = createSelector(
    ScoreboardSettingsState,
    CurrentTournamentId,
    (settingsByRouenamentId, tournamentId) => {
        return settingsByRouenamentId[tournamentId] ?? generateDefaultScoreboardSettings()
    }
)

export const LeaderboardVersions = createSelector(
    LeaderboardVersionsState,
    CurrentTournamentId,
    (leaderboardVersions, tournamentId) => {
        return leaderboardVersions[tournamentId] ?? []
    }
)

export const LeaderboardRows = createSelector(
    LeaderboardRowsState,
    CurrentTournamentId,
    CurrentSideTournamentId,
    (leaderboardRows, tournamentId, sideTournamentId) => {
        const rowsListByVersionId = leaderboardRows[tournamentId] ?? {}
        return mapValues(rowsListByVersionId,
            rows => (
                keyBy(rows.filter(row => row.sideTournamentId == sideTournamentId), 'user_tournament_id')
            )
        )
    }
)

export const Bets = createSelector(
    BetsState,
    CurrentTournamentId,
    (bets, tournamentId) => {
        return bets[tournamentId] ?? {}
    }
)

export const CurrentGameBetsFetcher = createSelector(
    GameBetsFetcherState,
    CurrentTournamentId,
    (gameBetsFetchers, tournamentId) => {
        return gameBetsFetchers[tournamentId] ?? generateEmptyGameBetFetcher()
    }
)

export const CurrentLeaderboardsFetcher = createSelector(
    LeaderboardsFetcherState,
    CurrentTournamentId,
    (fetchers, tournamentId) => {
        return fetchers[tournamentId] ?? generateEmptyFetcherSlice()
    }
)

export const IsTournamentAdmin = createSelector(
    CurrentTournamentUser,
    (utl) => {
        return utl?.role === UtlRole.Admin
    }
)

export const HasManagerPermissions = createSelector(
    CurrentTournamentUser,
    (utl) => {
        return [UtlRole.Admin, UtlRole.Manager].includes(utl?.role)
    }
)

export const GroupStandingBets = createSelector(Bets, (bets) => {
    const groupRankBets = pickBy(bets, (bet) => bet.type === BetType.GroupsRank)
    return groupRankBets as Record<number, GroupRankBetApiModel>
})

export const MatchBets = createSelector(Bets, (bets) => {
    const matchBets = pickBy(bets, (bet) => bet.type === BetType.Match)
    return matchBets as Record<number, MatchBetApiModel>
})

export const QuestionBets = createSelector(Bets, (bets) => {
    const questionBets = pickBy(bets, (bet) => bet.type === BetType.Question)
    return questionBets as Record<number, QuestionBetApiModel>
})

export const PrimalBets = createSelector(
    QuestionBets,
    GroupStandingBets,
    (questionBets, groupRankBets) => {
    return {
        ...questionBets,
        ...groupRankBets,
    }
})

export const TeamsByGroupId = createSelector(Teams, (teams) => {
    return groupBy(teams, 'group_id')
})
