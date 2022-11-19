import React, { useState } from 'react'
import { ScoreboardRowDetailed } from '../types'
import { maxBy } from 'lodash'
import SimpleTabs from '../widgets/Tabs/Tabs';
import { getHistoryLeaderboard, valuesOf } from '../utils';
import { useSelector } from 'react-redux';
import { Contestants, LeaderboardVersions } from '../_selectors';
import LeaderboardHistoryForm, { HistoryFormState } from './LeaderboardHistoryForm';
import LeaderboardTable from './LeaderboardTable';


interface Props {
    rows: ScoreboardRowDetailed[]
    hasData: boolean
    currentUtlId: number
    themeClass: string
    tournamentName: string
}

function LeaderboardView({ rows, hasData, currentUtlId, themeClass, tournamentName }: Props) {
    const versionsById = useSelector(LeaderboardVersions)
    const contestants = useSelector(Contestants)
    const [selectedStateIndex, setSelectedStateIndex] = useState(0)

    const latestVersion = maxBy(valuesOf(versionsById), 'created_at')
    const [historyForm, setHistoryForm] = useState<HistoryFormState>({to: latestVersion, from: undefined})

    const showHistoryForm = Object.keys(versionsById).length > 1
    const tabs = [
        {
            id: 'normal',
            label: 'מצב נוכחי',
            children: null,
        },
        {
            id: 'live',
            label: 'מצב חי (live)',
            children: null
        },
        ...(showHistoryForm ? [
            {
                id: 'history',
                label: 'מצב היסטורי',
                children: null
            }
        ] : [])
    ]

    const selectedState = tabs[selectedStateIndex]?.id ?? 'normal'

    const historyVersion = historyForm.to
    const prevHistoryVersion = historyForm.from || valuesOf(versionsById).find(v => v.order  === (historyVersion?.order - 1))
    const showHistory = historyVersion && selectedState === 'history'
    const models = showHistory
        ? getHistoryLeaderboard({historyVersion, contestants, prevVersion: prevHistoryVersion})
        : rows


    return (
        <div className={`LB-LeaderboardView ${themeClass}`}>
            <h1 className='LB-TitleText'>טבלת ניקוד</h1>
            <SimpleTabs
                tabs={tabs}
                index={selectedStateIndex}
                onChange={setSelectedStateIndex}

            />
            {selectedState === 'history' && showHistoryForm && (
                <LeaderboardHistoryForm
                    state={historyForm}
                    setState={setHistoryForm}
                    versionsById={versionsById}
                />
            )}

            <div className='LeaderboardView-content'>
                <div className='tableTitleContainer'>
                    <h4 className='tableTitle'>{tournamentName}</h4>
                </div>
                <LeaderboardTable
                    rows={models}
                    currentUtlId={currentUtlId}
                    expandable={selectedState !== 'history'}
                />
            </div>

        </div>
    )
}

export default LeaderboardView
