import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import { ScoreboardRowDetailed } from '../types'
import { CurrentTournamentName, CurrentTournamentUser, IsTournamentStarted, IsWaitingForMissingMvpAnswer } from '../_selectors'
import { LeaderboardSelector } from '../_selectors/leaderboard'
import LeaderboardView from './LeaderboardView'
import { generateEmptyScoreboardRow } from '../utils'
import { AppDispatch } from '../_helpers/store'
import { openDialog } from '../_actions/dialogs'
import { DialogName } from '../dialogs/types'
import CongratsAnimationProvider from './animations/CongratsAnimationProvider'
import './Leaderboard.scss'



function Leaderboard() {
    const dispatch = useDispatch<AppDispatch>()
    const { leaderboard, contestants } = useSelector(LeaderboardSelector)
    const themeClass =  useTournamentThemeClass()
    const isWaitingForMvp = useSelector(IsWaitingForMissingMvpAnswer)
    const currentUtl = useSelector(CurrentTournamentUser)
    const currentUtlId = currentUtl?.id
    const hasTournamentStatrted = useSelector(IsTournamentStarted)
    const tournamentName = useSelector(CurrentTournamentName)
    const hasData = leaderboard.length > 0
    let rows: ScoreboardRowDetailed[] = leaderboard
    if (!hasData) {
        rows = contestants.map(generateEmptyScoreboardRow)
    }

    const currentUtlRank = rows.find(row => row.user_tournament_id == currentUtlId)?.rank

    const openWaitForMvpDialog = () => {
        dispatch(openDialog(DialogName.WaitForMvp))
    }

    useEffect(() => {
        if (isWaitingForMvp) {
            openWaitForMvpDialog()
        }
    }, [isWaitingForMvp])

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
            <CongratsAnimationProvider currentUtl={currentUtl} rank={currentUtlRank} />
        </>
    )
}


export default Leaderboard
