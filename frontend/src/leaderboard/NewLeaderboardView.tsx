import React from 'react'
import { ScoreboardRow, ScoreboardRowDetailed } from '../types'
import { Dictionary } from 'lodash'
import CustomTable from '../widgets/Table/CustomTable'


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

function NewLeaderboardView({ rows, hasData, currentUtlId, themeClass, tournamentName }: Props) {
    const rankDisplayById = getRankDisplayById(rows)
    const cells = [
		{
			id: 'rank',
			header: '',
            classes: {
                header: 'rankCell',
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
			getter: (model: ScoreboardRowDetailed) => model.score,
		},
    ]
    const getRowClassName = (model: ScoreboardRowDetailed) => (
        model.user_tournament_id === currentUtlId ? 'currentUtl' : null
    )
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
                />
            </div>

        </div>
    )
}

export default NewLeaderboardView
