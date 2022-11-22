import React from 'react'
import { useSelector } from 'react-redux'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import { ScoreboardRowDetailed, UTL } from '../types'
import { CurrentTournamentName, CurrentTournamentUserId, IsTournamentStarted } from '../_selectors'
import { LeaderboardSelector } from '../_selectors/leaderboard'
import LeaderboardView from './LeaderboardView'
import './Leaderboard.scss'
import { generateEmptyScoreboardRow } from '../utils'



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
