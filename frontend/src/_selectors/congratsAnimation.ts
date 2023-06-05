import { createSelector } from 'reselect'
import { CurrentTournamentId, IsShowingLatestLeaderboard } from './base'
import { CurrentUtlRank, IsCurrentLeaderboardMissing, IsMissingMvpAnswer, IsOurTournament, ScoreboardSelector } from './logic'
import { IsCompetitionDone } from './modelRelations'
import dayjs from 'dayjs'


export const ShouldShowCongrats = createSelector(
    CurrentTournamentId,
    IsOurTournament,
    CurrentUtlRank,
    IsCompetitionDone,
    IsShowingLatestLeaderboard,
    IsCurrentLeaderboardMissing,
    IsMissingMvpAnswer,
    ScoreboardSelector,
    (tournamentId, isOurTournament, currentUtlRank, isCompetitionDone, isShowingLatestVersion, isCurrentLeaderboardMissing, isMvpMissing, leaderboardRows) => {
        const tournamentDone = isCompetitionDone && !isMvpMissing
        const isShowingUpToDateLeaderboard = isShowingLatestVersion && !isCurrentLeaderboardMissing
        const isCongratsAnimationEnabled = isOurTournament || currentUtlRank === 1

        const seenCongratsData = localStorage.getItem('LigaBetSeenCongratsAnimation')
        const lastSeenPerTournamentId: Record<number, number> = seenCongratsData ? JSON.parse(seenCongratsData) : {}
        const lastSeenTimestamp = lastSeenPerTournamentId[tournamentId]
        const seenRecently = lastSeenTimestamp ? (dayjs().diff(dayjs(lastSeenTimestamp), 'hours') < 24 * 3) : false

        return isCongratsAnimationEnabled && tournamentDone && !seenRecently && isShowingUpToDateLeaderboard
    }
)

export const CongratsAnimationSelector = createSelector(
    ShouldShowCongrats,
    CurrentUtlRank,
    ( showCongratsAnimation, currentUtlRank ) => {
        return {
            showCongratsAnimation,
            currentUtlRank,
        }
    }
)
