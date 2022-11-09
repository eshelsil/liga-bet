import React from 'react'
import { useSelector } from 'react-redux'
import { useTournamentThemeClass } from '../hooks/useTournamentTheme'
import { ScoreboardRowDetailed, UTL } from '../types'
import { CurrentTournamentName, CurrentTournamentUserId } from '../_selectors'
import { LeaderboardSelector } from '../_selectors/leaderboard'
import LeaderboardView from './LeaderboardView'
import NewLeaderboardView from './NewLeaderboardView'
import './Leaderboard.scss'


function generateEmptyScoreboardRow(contestant: UTL): ScoreboardRowDetailed {
    return {
        id: contestant.id,
        user_tournament_id: contestant.id,
        name: contestant.name,
        rank: 1,
        score: 0,
        change: 0,
        addedScore: 0,
    }
}


function Leaderboard() {
    const { leaderboard, contestants } = useSelector(LeaderboardSelector)
    const themeClass =  useTournamentThemeClass()
    const currentUtlId = useSelector(CurrentTournamentUserId)
    const tournamentName = useSelector(CurrentTournamentName)
    const hasData = leaderboard.length > 0
    let rows: ScoreboardRowDetailed[] = leaderboard
    if (!hasData) {
        rows = contestants.map(generateEmptyScoreboardRow)
    }

    return (
        <>
            <NewLeaderboardView
                rows={rows}
                currentUtlId={currentUtlId}
                hasData={hasData}
                themeClass={themeClass}
                tournamentName={tournamentName}
            />
            {/* {hasData && (
                <LeaderboardView rows={rows} hasData={hasData} />
            )}
            {!hasData && (
                <NewLeaderboardView
                    rows={rows}
                    currentUtlId={currentUtlId}
                    hasData={hasData}
                    themeClass={themeClass}
                />
            )} */}
        </>
    )
}


export default Leaderboard
