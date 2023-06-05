import React from 'react'
import { ScoreboardRowDetailed } from '../types'
import { useLiveUpdate, useMissingPlayersFetcher } from '../hooks/useLiveUpdate';
import { LoadingButton } from '../widgets/Buttons';
import { ScoreboardConfig } from '../_reducers/scoreboardSettings';
import { useLeaderboard } from '../hooks/useFetcher';
import LeaderboardTable from './LeaderboardTable';
import TableSettingsProvider from './TableSettingsProvider';



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
}

function LeaderboardView({ rows, tableSettings, currentUtlId, themeClass, tournamentName, isShowingHistoricTable }: Props) {
    const { refresh: refreshTable } = useLiveUpdate()

    const { liveMode } = tableSettings
    const { refetch, fetchFunc } = useLeaderboard()
    

    return (
        <div className={`LB-LeaderboardView ${themeClass}`}>
            <h1 className='LB-TitleText'>טבלת ניקוד</h1>
            <TableSettingsProvider fetchScoreboards={fetchFunc} />
            {!isShowingHistoricTable && (
                <LoadingButton
                    action={refreshTable}
                    className='LeaderboardView-refreshTableButton'
                >
                    רענן טבלה
                </LoadingButton>
            )}

            <div className='LeaderboardView-content'>
                <div className='tableTitleContainer'>
                    <h4 className='tableTitle'>{tournamentName}</h4>
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
