import { isEmpty, mapValues, orderBy } from 'lodash';
import { LeaderboardVersion, ScoreboardRow, ScoreboardRowById, ScoreboardRowDetailed, ScoreboardRowsByVersionId, UTL, UTLsById } from '../types';
import { ScoreboardConfig } from '../_reducers/scoreboardSettings';


export function calcLeaderboardDiff(leaderboard: ScoreboardRowById, prevLeaderboard?: ScoreboardRowById) {
    if (isEmpty(prevLeaderboard)){
        return mapValues(leaderboard, (contestant: ScoreboardRow) => ({
            ...contestant,
            addedScore: 0,
            change: 0,
        }))
    }
    return mapValues(leaderboard, (contestant: ScoreboardRow) => {
        const contestantOnPrevVersion =
            prevLeaderboard[contestant.user_tournament_id]
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
    leaderboard: Omit<ScoreboardRowDetailed, 'name'>[],
    contestants?: UTLsById,
) {
    const leaderBoardWithNames: ScoreboardRowDetailed[] = addNameToScoreBoardRows(leaderboard, contestants)
    const sortedScoreboard = orderBy(leaderBoardWithNames, 'rank')
    return sortedScoreboard

}

export function addNameToScoreBoardRows(
    leaderboardRows: Omit<ScoreboardRowDetailed, 'name'>[],
    contestants = {} as UTLsById,
): ScoreboardRowDetailed[] {
    return leaderboardRows.map(
        (scoreboardRow) => ({
            ...scoreboardRow,
            name: contestants[scoreboardRow.user_tournament_id]?.name ?? '',
        })
    )
}


export function generateEmptyScoreboardRow(contestant: UTL): ScoreboardRowDetailed {
    return {
        id: contestant.id,
        user_tournament_id: contestant.id,
        name: contestant.name,
        rank: 1,
        score: 0,
        change: 0,
        addedScore: 0,
        betScoreOverride: {}
    }
}

export function generateDefaultScoreboardSettings(): ScoreboardConfig {
    return {
        liveMode: false,
        upToDateMode: true,
        showChange: false,
    }
}

export function getLatestScoreboard(versions: LeaderboardVersion[], leaderboardRows: ScoreboardRowsByVersionId): ScoreboardRowById {
    const latestVersion = versions[0]
    if (!latestVersion) return {}
    return leaderboardRows[latestVersion.id] ?? {}
}