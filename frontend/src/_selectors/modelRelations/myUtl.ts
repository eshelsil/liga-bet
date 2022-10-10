import { createSelector } from 'reselect'
import { CurrentTournamentUserId, LatestLeaderboardVersion } from '../base'

export const MyUtlOnScoreboard = createSelector(
    CurrentTournamentUserId,
    LatestLeaderboardVersion,
    (utlId, leaderboard) => {
        return leaderboard[utlId]
    }
)
