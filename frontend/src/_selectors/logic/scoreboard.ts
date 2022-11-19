import { createSelector } from 'reselect'
import { calcLeaderboardVersionsDiff } from '../../utils'
import { LeaderboardVersionsDesc } from '../base'

export const LatestLeaderboard = createSelector(
    LeaderboardVersionsDesc,
    (versions) => {
        const latestVersion = versions[0]
        if (!latestVersion) return {}
        const prevVersion = versions[1]
        return calcLeaderboardVersionsDiff(latestVersion, prevVersion)
    }
)
