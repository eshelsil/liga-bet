import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { ScoreboardRowDetailed } from '../types'
import { maxBy } from 'lodash'
import SimpleTabs from '../widgets/Tabs/Tabs';
import { getHistoryLeaderboard, isGameLive, valuesOf } from '../utils';
import { Contestants, Games, LeaderboardVersions, LiveScoreboard } from '../_selectors';
import LeaderboardHistoryForm, { HistoryFormState } from './LeaderboardHistoryForm';
import LeaderboardTable from './LeaderboardTable';
import LiveModeFrom from './LiveModeFrom';
import { useLiveUpdate } from '../hooks/useLiveUpdate';
import { LoadingButton } from '../widgets/Buttons';


interface Props {
    rows: ScoreboardRowDetailed[]
    hasData: boolean
    currentUtlId: number
    themeClass: string
    tournamentName: string
    isTournamentStarted: boolean
}

function LeaderboardView({ rows, hasData, currentUtlId, themeClass, tournamentName, isTournamentStarted }: Props) {
    const { refresh: refreshTable } = useLiveUpdate()
    const versionsById = useSelector(LeaderboardVersions)
    const contestants = useSelector(Contestants)
    const liveTable = useSelector(LiveScoreboard)
    const games = useSelector(Games)
    const liveGameIds = valuesOf(games).filter(game => isGameLive(game)).map(game => game.id)
    const [selectedStateIndex, setSelectedStateIndex] = useState(0)

    const latestVersion = maxBy(valuesOf(versionsById), 'created_at')
    const [historyForm, setHistoryForm] = useState<HistoryFormState>({to: latestVersion, from: undefined})
    const [liveMode, setLiveMode] = useState(false)
    const toggleLiveMode = () => setLiveMode(!liveMode)

    const hasHistory = Object.keys(versionsById).length > 1
    const tabs = [
        {
            id: 'normal',
            label: 'מצב נוכחי',
            children: null,
        },
        {
            id: 'history',
            label: 'מצב היסטורי',
            children: null
        }
    ]

    const selectedState = tabs[selectedStateIndex]?.id ?? 'normal'

    const historyVersion = historyForm.to
    const prevHistoryVersion = historyForm.from || valuesOf(versionsById).find(v => v.order  === (historyVersion?.order - 1))
    const showHistory = historyVersion && selectedState === 'history'
    const showLiveTable = liveMode && !showHistory
    const models = showHistory
        ? getHistoryLeaderboard({historyVersion, contestants, prevVersion: prevHistoryVersion})
        : showLiveTable
            ? liveTable
            : rows

    const isHistoryTableFeatureOn = false

    return (
        <div className={`LB-LeaderboardView ${themeClass}`}>
            <h1 className='LB-TitleText'>טבלת ניקוד</h1>
            {isHistoryTableFeatureOn && hasHistory && isTournamentStarted && (
                <SimpleTabs
                    tabs={tabs}
                    index={selectedStateIndex}
                    onChange={setSelectedStateIndex}

                />
            )}
            {hasHistory && showHistory && (
                <LeaderboardHistoryForm
                    state={historyForm}
                    setState={setHistoryForm}
                    versionsById={versionsById}
                />
            )}
            {!showHistory && (<>
                <LiveModeFrom
                    liveGameIds={liveGameIds}
                    liveMode={liveMode}
                    toggleLiveMode={toggleLiveMode}
                />
                <LoadingButton
                    action={refreshTable}
                    className='LeaderboardView-refreshTableButton'
                >
                    רענן טבלה
                </LoadingButton>
            </>
            )}

            <div className='LeaderboardView-content'>
                <div className='tableTitleContainer'>
                    <h4 className='tableTitle'>{tournamentName}</h4>
                </div>
                <LeaderboardTable
                    rows={models}
                    currentUtlId={currentUtlId}
                    expandable={selectedState !== 'history'}
                    isLive={showLiveTable}
                />
            </div>

        </div>
    )
}

export default LeaderboardView
