import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { LeaderboardSelector } from '../_selectors/leaderboard'
import LeaderboardView from './LeaderboardView'



function Leaderboard() {
    const { leaderboard, hasTournamentStarted } = useSelector(LeaderboardSelector)

    return (
        <>
            {!hasTournamentStarted && (
                <h2>הטבלה תהיה זמינה ברגע שיתחיל המשחק הראשון בטורניר</h2>
            )}
            {hasTournamentStarted && <LeaderboardView rows={leaderboard} />}
        </>
    )
}


export default Leaderboard
