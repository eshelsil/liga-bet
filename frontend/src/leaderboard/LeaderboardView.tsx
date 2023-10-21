import React, { useState } from 'react'
import { ScoreboardRowDetailed, SideTournament } from '../types'
import { useLiveUpdate, useMissingPlayersFetcher } from '../hooks/useLiveUpdate';
import { LoadingButton } from '../widgets/Buttons';
import { ScoreboardConfig } from '../_reducers/scoreboardSettings';
import { useLeaderboard } from '../hooks/useFetcher';
import LeaderboardTable from './LeaderboardTable';
import TableSettingsProvider from './TableSettingsProvider';
import { Button } from '@mui/material';
import ScoreboardProgressDiagramProvider from './progressDiagram/ProgressDiagramProvider';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import SideTournamentsDrawer from './SideTournamentsDrawer';



function SideTournamentTitle({sideTournament} : {sideTournament: SideTournament}) {
    const {emblem, name} = sideTournament
    return (
        <div className='LB-SideTournamentTitle'>
            {emblem && (
                <img className='SideTournamentTitle-emblem' src={emblem}/>
            )}
            <div>{name}</div>
        </div>
    )
}

function EnsureMissingPlayerFetched() {
    useMissingPlayersFetcher()
    return null
}

interface Props {
    rows: ScoreboardRowDetailed[]
    tableSettings: ScoreboardConfig
    currentUtlId: number
    themeClass: string
    tournamentName: string
    isShowingHistoricTable: boolean
    selectSideTournament: (id: number) => void
    sideTournaments: SideTournament[],
    currentSideTournament: SideTournament,
}

function LeaderboardView({ rows, tableSettings, currentUtlId, themeClass, tournamentName, isShowingHistoricTable, selectSideTournament, sideTournaments, currentSideTournament }: Props) {
    const { refresh: refreshTable } = useLiveUpdate()

    const { liveMode } = tableSettings
    const { refetch, fetchFunc } = useLeaderboard()
    const [showProgressDiagram, setShowProgressDiagram] = useState(false)

    const isWatchingSideTournament = !!currentSideTournament?.id
    const hasSideTournaments = sideTournaments.length > 0
    

    return (
        <div className={`LB-LeaderboardView ${themeClass}`}>
            <h1 className='LB-TitleText'>טבלת ניקוד</h1>
            <TableSettingsProvider fetchScoreboards={fetchFunc} />
            {!isShowingHistoricTable && (
                <div className='LeaderboardView-buttons'>
                    <LoadingButton
                        action={refreshTable}
                        className='LeaderboardView-refreshTableButton'
                    >
                        רענן טבלה
                    </LoadingButton>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => setShowProgressDiagram(true)}
                    >
                        מה היה לנו פה?
                        <OndemandVideoIcon style={{marginRight: '4px'}} />
                    </Button>
                </div>
            )}
            {showProgressDiagram && (
                <ScoreboardProgressDiagramProvider onClose={() => setShowProgressDiagram(false)}/>
            )}

            <div className='LeaderboardView-content'>
                <div className='tableTitleContainer'>
                    <h4 className='tableTitle'>
                        {isWatchingSideTournament ? <SideTournamentTitle sideTournament={currentSideTournament} /> : tournamentName}
                    </h4>
                    {hasSideTournaments && (
                        <SideTournamentsDrawer 
                            selectSideTournament={selectSideTournament}
                            sideTournaments={sideTournaments}
                            selectedSideTournamentId={currentSideTournament?.id}
                        />
                    )}
                </div>
                <LeaderboardTable
                    rows={rows}
                    currentUtlId={currentUtlId}
                    isLive={liveMode}
                />
            </div>
            {liveMode && (
                <EnsureMissingPlayerFetched />
            )}
        </div>
    )
}

export default LeaderboardView
