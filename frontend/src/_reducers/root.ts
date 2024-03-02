import { combineReducers } from 'redux'
import bets from './bets'
import dataFetcher from './dataFetcher'
import gameBetsFetcher from './gameBetsFetcher'
import leaderboardsFetcher from './leaderboardsFetcher'
import currentUser from './currentUser'
import groups from './groups'
import leaderboardVersions from './leaderboardVersions'
import leaderboardRows from './leaderboardRows'
import scoreboardSettings from './scoreboardSettings'
import matches from './matches'
import myUtls from './myUtls'
import tournamentUTLs from './tournamentUTLs'
import specialQuestions from './specialQuestions'
import teams from './teams'
import tournamentUser from './tournamentUser'
import contestants from './contestants'
import users from './users'
import usersTotalCount from './usersTotalCount'
import ownedTournaments from './ownedTournament'
import competitions from './competitions'
import players from './players'
import dialogs from './dialogs'
import dialogsData from './dialogsData'
import appCrucialLoaders from './appCrucialLoaders'
import notifications from './notifications'
import multiBetsSettings from './multiBetsSettings'
import goalsData from './goalsData'
import adminReducer from './admin/admin'
import sideTournament from './sideTournament'

const reducer = combineReducers({
    bets: bets.reducer,
    dataFetcher: dataFetcher.reducer,
    gameBetsFetcher: gameBetsFetcher.reducer,
    leaderboardsFetcher: leaderboardsFetcher.reducer,
    teams: teams.reducer,
    leaderboardVersions: leaderboardVersions.reducer,
    leaderboardRows: leaderboardRows.reducer,
    scoreboardSettings: scoreboardSettings.reducer,
    specialQuestions: specialQuestions.reducer,
    players: players.reducer,
    matches: matches.reducer,
    groups: groups.reducer,
    currentUser: currentUser.reducer,
    contestants: contestants.reducer,
    myUtls: myUtls.reducer,
    currentTournamentUser: tournamentUser.reducer,
    selectedSideTournamentId: sideTournament.reducer,
    ownedTournaments: ownedTournaments.reducer,
    competitions: competitions.reducer,
    tournamentUTLs: tournamentUTLs.reducer,
    users: users.reducer,
    usersTotalCount: usersTotalCount.reducer,
    dialogs: dialogs.reducer,
    dialogsData: dialogsData.reducer,
    appCrucialLoaders: appCrucialLoaders.reducer,
    notifications: notifications.reducer,
    multiBetsSettings: multiBetsSettings.reducer,
    goalsData: goalsData.reducer,
    admin: adminReducer,
})

export default reducer
