import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import { CurrentSideTournament, CurrentTournament, CurrentTournamentName, CurrentTournamentUserId, IsShowingHistoricScoreboard, IsWaitingForMissingMvpAnswer, ScoreboardSettings } from '../_selectors'
import { LeaderboardSelector } from '../_selectors/leaderboard'
import LeaderboardView from './LeaderboardView'
import { AppDispatch } from '../_helpers/store'
import { openDialog } from '../_actions/dialogs'
import { DialogName } from '../dialogs/types'
import CongratsAnimationProvider from './animations/CongratsAnimationProvider'
import { ExpandedContestantContextProvider } from './ExpandedContestantContext';
import { selectSideTournament } from '../_actions/sideTournament'
import './Leaderboard.scss'
import { updateWhatifsIsOn } from '@/_actions/whatifs'
import useGoTo from '@/hooks/useGoTo'



function Leaderboard() {
    const dispatch = useDispatch<AppDispatch>()
    const { leaderboard, isCurrentLeaderboardMissing, isSideTournament } = useSelector(LeaderboardSelector)
    const { goToOpenGameBets } = useGoTo()
    const themeClass =  useTournamentThemeClass()
    const isWaitingForMvp = useSelector(IsWaitingForMissingMvpAnswer)
    const currentUtlId = useSelector(CurrentTournamentUserId)
    const tournamentName = useSelector(CurrentTournamentName)
    const tableSettings = useSelector(ScoreboardSettings)
    const isShowingHistoricTable = useSelector(IsShowingHistoricScoreboard)
    const currentSideTournament = useSelector(CurrentSideTournament)
    const currentTournament = useSelector(CurrentTournament)
    const participatingSideTournaments = currentTournament.sideTournaments?.filter(st => st.competingUtls.includes(currentUtlId))
    
    const [rows, setRows] = useState(leaderboard);


    const openWaitForMvpDialog = () => {
        dispatch(openDialog(DialogName.WaitForMvp))
    }
    const onSelectSideTournament = (id: number) => {
        dispatch(selectSideTournament(id))
    }
    const goToWhatif = () => {
        dispatch(updateWhatifsIsOn(true))
        goToOpenGameBets()
    }

    useEffect(() => {
        if (isWaitingForMvp) {
            openWaitForMvpDialog()
        }
    }, [isWaitingForMvp])

    useEffect(() => {
        if (!isCurrentLeaderboardMissing || isSideTournament){
            setRows(leaderboard)
        }
    }, [isCurrentLeaderboardMissing, leaderboard])


    return (
        <>
            <ExpandedContestantContextProvider>
                <LeaderboardView
                    rows={rows}
                    currentUtlId={currentUtlId}
                    tableSettings={tableSettings}
                    themeClass={themeClass}
                    tournamentName={tournamentName}
                    isShowingHistoricTable={isShowingHistoricTable}
                    selectSideTournament={onSelectSideTournament}
                    sideTournaments={participatingSideTournaments}
                    currentSideTournament={currentSideTournament}
                    goToWhatif={goToWhatif}
                />
            </ExpandedContestantContextProvider>
            {/* <CongratsAnimationProvider /> */}
        </>
    )
}


export default Leaderboard
