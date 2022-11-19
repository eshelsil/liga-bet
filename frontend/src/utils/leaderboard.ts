import { Dictionary, mapValues, orderBy } from 'lodash';
import { LeaderboardVersion, LeaderboardVersionById, ScoreboardRow, ScoreboardRowDetailed, UTLsById } from '../types';
import { valuesOf } from './common';

export function sortLeaderboardVersions(versions: LeaderboardVersionById, direction: 'asc' | 'desc' = 'desc') {
    return orderBy(valuesOf(versions), 'created_at', direction)
}

export function getScoreOfUtl(versions: LeaderboardVersionById, utlId: number) {
    const sortedVersions = sortLeaderboardVersions(versions)
    const currentVersion = sortedVersions[0]
    if (!currentVersion){
        return undefined
    }
    const currentVersionRow = currentVersion[utlId]
    if (!currentVersionRow){
        return undefined
    }
    const prevVersion = sortedVersions[1]
    const prevVersionRow = prevVersion ? prevVersion[utlId] : undefined
    const {rank, score} = currentVersionRow
    const {rank: prevRank, score: prevScore} = prevVersionRow || {}
    return {
        ...currentVersionRow,
        addedScore: score - (prevScore ?? 0),
        change: prevRank ? prevRank - rank : 0,
    }

}

export function calcLeaderboardVersionsDiff(version: LeaderboardVersion, prevVersion?: LeaderboardVersion) {
    const prevVersionContestantsById = prevVersion?.leaderboard ?? {}
    const constestantsById = version.leaderboard
    return mapValues(constestantsById, (contestant: ScoreboardRow) => {
        const contestantOnPrevVersion =
            prevVersionContestantsById[contestant.user_tournament_id]
        const { rank, score } = contestant
        const { rank: prevRank, score: prevScore } =
            contestantOnPrevVersion ?? {}
        return {
            ...contestant,
            addedScore: score - (prevScore ?? 0),
            change: prevRank ? prevRank - rank : 0,
        }
    })

}

export function formatLeaderboardVersion(
    leaderboard: Dictionary<Omit<ScoreboardRowDetailed, 'name'>>,
    contestants?: UTLsById,
) {
    const leaderBoardWithNames: ScoreboardRowDetailed[] = addNameToScoreBoardRows(leaderboard, contestants)
    const sortedScoreboard = orderBy(leaderBoardWithNames, 'rank')
    return sortedScoreboard

}

export function addNameToScoreBoardRows(
    leaderboard: Dictionary<Omit<ScoreboardRowDetailed, 'name'>>,
    contestants = {} as UTLsById,
): ScoreboardRowDetailed[] {
    return valuesOf(leaderboard).map(
        (scoreboardRow) => ({
            ...scoreboardRow,
            name: contestants[scoreboardRow.user_tournament_id]?.name ?? '',
        })
    )
}

export function getHistoryLeaderboard({
    historyVersion,
    contestants,
    prevVersion,
}: {
    historyVersion: LeaderboardVersion,
    contestants: UTLsById
    prevVersion?: LeaderboardVersion
}){
    const leaderboard = calcLeaderboardVersionsDiff(historyVersion, prevVersion)
    return formatLeaderboardVersion(leaderboard, contestants)


}