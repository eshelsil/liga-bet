import React, { useState } from 'react'
import { ScoreboardRow, ScoreboardRowDetailed } from '../types'
import { Dictionary } from 'lodash'
import CustomTable from '../widgets/Table/CustomTable'
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExpandedContestant from './ExpandedContestantProvider'
import { usePrizesThemeClass } from '../hooks/useThemeClass'


function getRankDisplayById(rows: ScoreboardRow[]) {
    const rankDisplayById = {} as Dictionary<string>
    let lastRank = 0
    for (const row of rows) {
        const { rank, id } = row
        if (lastRank === row.rank) {
            rankDisplayById[id] = '-'
        } else {
            lastRank = rank
            rankDisplayById[id] = `${rank}.`
        }
    }
    return rankDisplayById
}

interface Props {
    rows: ScoreboardRowDetailed[]
    hasData: boolean
    currentUtlId: number
    themeClass: string
    tournamentName: string
}

function LeaderboardView({ rows, hasData, currentUtlId, themeClass, tournamentName }: Props) {
    const rankDisplayById = getRankDisplayById(rows)
    const [expand, setExpand] = useState<number>(null)
    const getPrizeTheme = usePrizesThemeClass()
    const hasScores = !!rows.find(row => row.score > 0)
    
    const onRowClick = (model: ScoreboardRowDetailed) => {
        if (expand === model.user_tournament_id){
            setExpand(null)
        } else {
            setExpand(model.user_tournament_id)
        }
    }
    const getExpandContent = (model: ScoreboardRowDetailed) => (
        model.user_tournament_id === expand
        ? (
            <ExpandedContestant utlId={model.user_tournament_id} />
        ) : null
    )


    const cells = [
		{
			id: 'rankChange',
			header: '',
            classes: {
                header: 'rankChangeCell',
                cell: 'rankChangeCell',
            },
            getter: (model: ScoreboardRowDetailed) => (
                <>
                    {!!model.change && (
                        <div className={`rankChange ${model.change < 0 ? 'isNegative' : ''}`}>
                            <span className='rankChange-value'>{Math.abs(model.change)}</span>
                            <ArrowDownIcon className='rankChange-direction'/>
                        </div>
                    )}
                </>
            ),
		},
		{
			id: 'rank',
			header: '',
            classes: {
                header: 'rankCell',
                cell: 'rankCell',
            },
            getter: (model: ScoreboardRowDetailed) => rankDisplayById[model.id],
		},
		{
			id: 'name',
			header: 'שם',
			getter: (model: ScoreboardRowDetailed) => model.name,
		},
		{
			id: 'score',
			header: 'ניקוד',
            classes: {
                header: 'scoreCell',
            },
			getter: (model: ScoreboardRowDetailed) => (
                <div className='scoreCell-container'>
                    <div className='scoreCell-total'>
                        {model.score}
                    </div>
                    {!!model.addedScore && (
                        <div className='scoreCell-added'>
                            <span>{model.addedScore}</span>
                            <span>+</span>
                        </div>
                    )}
                </div>
            ),
		},
    ]

    const getRowClassName = (model: ScoreboardRowDetailed) => {
        const currentUtl = model.user_tournament_id === currentUtlId ? 'currentUtl' : ''
        const index = rows.findIndex(row => row.id === model.id)
        const prizeClass = hasScores ? getPrizeTheme(index + 1) : ''
        return `${currentUtl} ${prizeClass}`
    }


    return (
        <div className={`LB-LeaderboardView ${themeClass}`}>
            <h1 className='LB-TitleText'>טבלת ניקוד</h1>

            <div className='LeaderboardView-content'>
                <div className='tableTitleContainer'>
                    <h4 className='tableTitle'>{tournamentName}</h4>
                </div>
                <CustomTable
                    models={rows}
                    cells={cells}
                    getRowClassName={getRowClassName}
                    onModelRowClick={onRowClick}
                    getExpandContent={getExpandContent}
                />
            </div>

        </div>
    )
}

export default LeaderboardView
