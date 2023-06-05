import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import { CurrentTournamentName, CurrentTournamentUserId, IsShowingHistoricScoreboard, IsWaitingForMissingMvpAnswer, ScoreboardSettings } from '../_selectors'
import { LeaderboardSelector } from '../_selectors/leaderboard'
import LeaderboardView from './LeaderboardView'
import { AppDispatch } from '../_helpers/store'
import { openDialog } from '../_actions/dialogs'
import { DialogName } from '../dialogs/types'
import CongratsAnimationProvider from './animations/CongratsAnimationProvider'
import './Leaderboard.scss'



function Leaderboard() {
    const dispatch = useDispatch<AppDispatch>()
    const { leaderboard, isCurrentLeaderboardMissing } = useSelector(LeaderboardSelector)
    const themeClass =  useTournamentThemeClass()
    const isWaitingForMvp = useSelector(IsWaitingForMissingMvpAnswer)
    const currentUtlId = useSelector(CurrentTournamentUserId)
    const tournamentName = useSelector(CurrentTournamentName)
    const tableSettings = useSelector(ScoreboardSettings)
    const isShowingHistoricTable = useSelector(IsShowingHistoricScoreboard)
    
    const [rows, setRows] = useState(leaderboard);


    const openWaitForMvpDialog = () => {
        dispatch(openDialog(DialogName.WaitForMvp))
    }

    useEffect(() => {
        if (isWaitingForMvp) {
            openWaitForMvpDialog()
        }
    }, [isWaitingForMvp])

    useEffect(() => {
        if (!isCurrentLeaderboardMissing){
            setRows(leaderboard)
        }
    }, [isCurrentLeaderboardMissing, leaderboard])


    return (
        <>
            <LeaderboardView
                rows={rows}
                currentUtlId={currentUtlId}
                tableSettings={tableSettings}
                themeClass={themeClass}
                tournamentName={tournamentName}
                isShowingHistoricTable={isShowingHistoricTable}
            />
            <CongratsAnimationProvider />
        </>
    )
}


export default Leaderboard
