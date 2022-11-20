import React from 'react'
import { useSelector } from 'react-redux'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import { ScoreboardRowDetailed, UTL } from '../types'
import { CurrentTournamentName, CurrentTournamentUserId, IsTournamentStarted } from '../_selectors'
import { LeaderboardSelector } from '../_selectors/leaderboard'
import LeaderboardView from './LeaderboardView'
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
    const hasTournamentStatrted = useSelector(IsTournamentStarted)
    const tournamentName = useSelector(CurrentTournamentName)
    const hasData = leaderboard.length > 0
    let rows: ScoreboardRowDetailed[] = leaderboard
    if (!hasData) {
        rows = contestants.map(generateEmptyScoreboardRow)
    }

    return (
        <>
            <LeaderboardView
                rows={rows}
                currentUtlId={currentUtlId}
                hasData={hasData}
                themeClass={themeClass}
                tournamentName={tournamentName}
                isTournamentStarted={hasTournamentStatrted}
            />
        </>
    )
}


export default Leaderboard
