import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScoreboardRowDetailed, SideTournament } from '../types'
import { useLiveUpdate, useMissingPlayersFetcher } from '../hooks/useLiveUpdate'
import { LoadingButton } from '../widgets/Buttons'
import { ScoreboardConfig } from '../_reducers/scoreboardSettings'
import { useLeaderboard } from '../hooks/useFetcher'
import LeaderboardTable from './LeaderboardTable'
import TableSettingsProvider from './TableSettingsProvider'
import { Button } from '@mui/material'
import ScoreboardProgressDiagramProvider from './progressDiagram/ProgressDiagramProvider'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo'
import SideTournamentsDrawer from './SideTournamentsDrawer'
import { cn } from '@/utils'
import { IsTournamentStarted } from '@/_selectors'
import { useSelector } from 'react-redux'

function SideTournamentTitle({
    sideTournament,
}: {
    sideTournament: SideTournament
}) {
    const { emblem, name } = sideTournament
    return (
        <div className="LB-SideTournamentTitle">
            {emblem && (
                <img className="SideTournamentTitle-emblem" src={emblem} />
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
    sideTournaments: SideTournament[]
    currentSideTournament: SideTournament
}

function LeaderboardView({
    rows,
    tableSettings,
    currentUtlId,
    themeClass,
    tournamentName,
    isShowingHistoricTable,
    selectSideTournament,
    sideTournaments,
    currentSideTournament,
}: Props) {
    const { t } = useTranslation('leaderboard')
    const { refresh: refreshTable } = useLiveUpdate()

    const { liveMode } = tableSettings
    const iTournamentStarted = useSelector(IsTournamentStarted)
    const { refetch, fetchFunc } = useLeaderboard()
    const [showProgressDiagram, setShowProgressDiagram] = useState(false)

    const isWatchingSideTournament = !!currentSideTournament?.id
    const hasSideTournaments = sideTournaments.length > 0

    return (
        <div className={`LB-LeaderboardView ${themeClass}`}>
            <h1 className="LB-TitleText">{t('view.title')}</h1>
            <TableSettingsProvider fetchScoreboards={fetchFunc} />
            {!isShowingHistoricTable && (
                <>
                    <div
                        className={cn('mt-4 flex items-center justify-between')}
                    >
                        <LoadingButton
                            action={refreshTable}
                            className="LeaderboardView-refreshTableButton"
                        >
                            {t('view.refreshTable')}
                        </LoadingButton>
                        {iTournamentStarted && (
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={() => setShowProgressDiagram(true)}
                            >
                                {t('view.whatHappenedHere')}
                                <OndemandVideoIcon className={cn('ms-2')} />
                            </Button>
                        )}
                        {!iTournamentStarted && <div />}
                    </div>
                </>
            )}
            {showProgressDiagram && (
                <ScoreboardProgressDiagramProvider
                    onClose={() => setShowProgressDiagram(false)}
                />
            )}

            <div className="LeaderboardView-content">
                <div className="tableTitleContainer">
                    <h4 className="tableTitle">
                        {isWatchingSideTournament ? (
                            <SideTournamentTitle
                                sideTournament={currentSideTournament}
                            />
                        ) : (
                            tournamentName
                        )}
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
            {liveMode && <EnsureMissingPlayerFetched />}
        </div>
    )
}

export default LeaderboardView
