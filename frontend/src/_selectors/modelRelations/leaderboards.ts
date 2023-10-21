import { createSelector } from 'reselect'
import { CurrentSideTournament, CurrentSideTournamentId, LeaderboardRowsState, LeaderboardVersionsDesc, LeaderboardVersionsState, MyUtls } from '../base';
import { filter, keyBy, mapValues } from 'lodash';
import { MatchesWithTeams } from './matches';
import { keysOf } from '../../utils';


export const LatestLeaderboardByTournamentId = createSelector(
    LeaderboardVersionsState,
    LeaderboardRowsState,
    (versionsByTournamentId, leaderboardRowsByTournamentId) => {
        return mapValues(versionsByTournamentId, (versionsDesc, tournamentId) => {
            const latestVersion = versionsDesc[0];
            if (!latestVersion){
                return {}
            }
            const leaderboardRowsByVersionId = leaderboardRowsByTournamentId[Number(tournamentId)]
            if (!leaderboardRowsByVersionId){
                return {}
            }
            const leaderboardRows = leaderboardRowsByVersionId[latestVersion.id]
            if (!leaderboardRows){
                return {}
            }
            return keyBy(leaderboardRows.filter(row => !row.sideTournamentId), 'user_tournament_id')
        })
    }
)

export const MyScoreByTournamentId = createSelector(
    LatestLeaderboardByTournamentId,
    MyUtls,
    (latestLeaderboardRowsByTournamentId, myUtls) => {
        return mapValues(latestLeaderboardRowsByTournamentId, scoreboardRowsByUtlId => {
            for (const utlId of keysOf(myUtls)){
                const utlRow = scoreboardRowsByUtlId[utlId] || null
                if (utlRow) {
                    return utlRow
                }
            }
        })
    }
)

export const LeaderboardVersionsWithGames = createSelector(
    LeaderboardVersionsDesc,
    MatchesWithTeams,
    CurrentSideTournament,
    (versions, gamesById, currentSideTournament) => {
        return filter(
            versions.map(
                version => ({
                    ...version,
                    game: gamesById[version.gameId]
                })
            ),
            v => !!v.game && (!currentSideTournament?.id || currentSideTournament.gameIds.indexOf(v.game.id) > -1)
        )
    }
)