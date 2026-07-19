import { createSelector } from 'reselect'
import { CurrentTournamentConfig, CurrentTournamentUser, IsShowingLatestLeaderboard } from './base'
import { CurrentUtlRank, IsCurrentLeaderboardMissing, IsMissingMvpAnswer } from './logic'
import { IsCompetitionDone } from './modelRelations'
import { CongratsAnimationConfig, CongratsDefaultEntry, CongratsRankEntry } from '../types'


export const CongratsAnimationConfigSelector = createSelector(
    CurrentTournamentConfig,
    (config): CongratsAnimationConfig | undefined => config?.congratsAnimation,
)

export const HasCongratsAnimation = createSelector(
    CongratsAnimationConfigSelector,
    (config) => !!config?.enabled,
)

export const CongratsAnimationLangSelector = createSelector(
    CongratsAnimationConfigSelector,
    (config) => config?.lang ?? 'he',
)

// The content (animation type + title + msg) for the current user's finishing rank,
// falling back to the configured `default` entry for any rank not listed explicitly.
export const CurrentCongratsEntry = createSelector(
    CongratsAnimationConfigSelector,
    CurrentUtlRank,
    (config, rank): CongratsRankEntry | CongratsDefaultEntry | null => {
        if (!config || rank == null) {
            return null
        }
        return config.ranks?.find((entry) => entry.rank === rank) ?? config.default ?? null
    },
)

// Tournament-level readiness: enabled, done (incl. MVP answered), showing the final
// up-to-date leaderboard, and the current user actually has a finishing rank.
const IsCongratsLeaderboardReady = createSelector(
    HasCongratsAnimation,
    CurrentUtlRank,
    IsCompetitionDone,
    IsShowingLatestLeaderboard,
    IsCurrentLeaderboardMissing,
    IsMissingMvpAnswer,
    (hasCongratsAnimation, currentUtlRank, isCompetitionDone, isShowingLatestVersion, isCurrentLeaderboardMissing, isMvpMissing) => {
        const tournamentDone = isCompetitionDone && !isMvpMissing
        const isShowingUpToDateLeaderboard = isShowingLatestVersion && !isCurrentLeaderboardMissing
        return hasCongratsAnimation && tournamentDone && isShowingUpToDateLeaderboard && currentUtlRank != null
    },
)

export const HasSeenCongrats = createSelector(
    CurrentTournamentUser,
    (utl) => !!utl?.congratsSeenAt,
)

// The replay button is available (and replay is possible) whenever the tournament is ready.
export const IsCongratsAnimationAvailable = IsCongratsLeaderboardReady

// The animation auto-plays only the first time — before the user has seen it.
export const ShouldAutoShowCongrats = createSelector(
    IsCongratsLeaderboardReady,
    HasSeenCongrats,
    (isReady, hasSeen) => isReady && !hasSeen,
)

export const CongratsAnimationSelector = createSelector(
    IsCongratsAnimationAvailable,
    ShouldAutoShowCongrats,
    CurrentUtlRank,
    CurrentCongratsEntry,
    CongratsAnimationLangSelector,
    (isAvailable, shouldAutoShow, currentUtlRank, entry, lang) => ({
        isAvailable,
        shouldAutoShow,
        currentUtlRank,
        entry,
        lang,
    }),
)
