import React, { ReactNode } from 'react'
import dayjs from 'dayjs'
import CustomTable from '../widgets/Table/CustomTable'
import { Match, WinnerSide } from '../types'
import { Model as TableModel } from '../widgets/Table';
import TeamWithFlagVertical from '../widgets/TeamFlag/TeamWithFlagVertical'
import { useTournamentThemeClass } from '../hooks/useThemeClass'


interface RowModel {
    id: string,
    home?: ReactNode,
    delimiter?: ReactNode,
    away?: ReactNode,
}

function GameHeader({ match }: { match: Match }) {
    const tournamentClass = useTournamentThemeClass()
    const { home_team, away_team, start_time, is_done, winner_side, result_away, result_home, id, is_knockout } = match
    let full_result_away: number;
    let full_result_home: number;
    const hasFullResult = false;
    const models: (RowModel | TableModel)[] = [
        // {
		// 	id: 'date',
		// 	isFullRow: true,
		// 	fullRowContent: (
        //         <span className='GameHeader-date'>
        //             {dayjs(start_time).format('DD/MM')}
        //         </span>
		// 	),
        //     fullRowCellClass: 'dateRowCell'
		// },
        ...( true || is_done ? [
            {
                id: '90min',
                home: result_home,
                away: result_away,
                delimiter: is_knockout ? '90\'' : '',
            },
            ...(is_knockout ? [
                ...(hasFullResult ? [
                    {
                        id: '120min',
                        home: full_result_home,
                        away: full_result_away,
                        delimiter: '120\'',
                    },
                ] : []),
                {
                    id: 'qualifier',
                    home: winner_side === WinnerSide.Home ? '✌️' : '',
                    away: winner_side !== WinnerSide.Away ? '✌️' : '',
                    delimiter: 'מעפילה',
                },
            ]: []),
        ] : [])
    ]
    const cells = [
        {
            id: 'home',
            header: (
                <TeamWithFlagVertical
                    name={home_team.name}
                />
            ),
            classes: {
                header: 'teamDisplayCell',
                cell: 'scoreCell',
            },
            getter: (model: RowModel) => model.home,
        },
        {
            id: 'delimiter',
            header: (
                <span style={{ padding: 8 }}>-</span>
            ),
            classes: {
                header: 'delimitierHeader',
            },
            getter: (model: RowModel) => model.delimiter,
        },
        {
            id: 'away',
            header: (
                <TeamWithFlagVertical
                    name={away_team.name}
                />
            ),
            classes: {
                header: 'teamDisplayCell',
                cell: 'scoreCell',
            },
            getter: (model: RowModel) => model.away,
        },
    ]
    return (
        <div className={`LB-GameHeader ${tournamentClass}`}>
            <CustomTable
                models={models}
                cells={cells}
            />
        </div>
    )
}


export default GameHeader
