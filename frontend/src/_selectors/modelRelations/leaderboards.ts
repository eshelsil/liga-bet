import { createSelector } from 'reselect'
import { LeaderboardRowsState, LeaderboardVersionsDesc, LeaderboardVersionsState, MyUtls } from '../base';
import { filter, mapValues } from 'lodash';
import { ScoreboardRow } from '../../types';
import { MatchesWithTeams } from './matches';
import { keysOf } from '../../utils';


export const MyScoreByTournamentId = createSelector(
    LeaderboardVersionsState,
    LeaderboardRowsState,
    MyUtls,
    (versionsByTournamentId, leaderboardRowsByTournamentId, myUtls) => {
        return mapValues({...versionsByTournamentId}, (versionsDesc, tournamentId) => {
            const latestVersion = versionsDesc[0];
            if (!latestVersion){
                return null
            }
            const leaderboardRowsByVersionId = leaderboardRowsByTournamentId[Number(tournamentId)]
            if (!leaderboardRowsByVersionId){
                return null
            }
            const leaderboardRows = leaderboardRowsByVersionId[latestVersion.id]
            if (!leaderboardRows){
                return null
            }
            let utlRow: ScoreboardRow = null
            for (const utlId of keysOf(myUtls)){
                utlRow = leaderboardRows[utlId] || null
                if (utlRow) {
                    break
                }
            }
            return utlRow
        })
    }
)

export const LeaderboardVersionsWithGames = createSelector(
    LeaderboardVersionsDesc,
    MatchesWithTeams,
    (versions, gamesById) => {
        return filter(
            versions.map(
                version => ({
                    ...version,
                    game: gamesById[version.gameId]
                })
            ),
            v => !!v.game
        )
    }
)