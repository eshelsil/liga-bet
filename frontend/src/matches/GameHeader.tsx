import React, { ReactNode } from 'react'
import CustomTable from '../widgets/Table/CustomTable'
import { Match, WinnerSide } from '../types'
import { Model as TableModel } from '../widgets/Table';
import TeamWithFlagVertical from '../widgets/TeamFlag/TeamWithFlagVertical'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import { getWinnerSide } from '../utils';


interface RowModel {
    id: string,
    home?: ReactNode,
    delimiter?: ReactNode,
    away?: ReactNode,
}

function GameHeader({ match, onClick }: { match: Match, onClick?: () => void }) {
    const tournamentClass = useTournamentThemeClass()
    const { home_team, away_team, start_time, is_done, winner_side, result_away, full_result_home, full_result_away, result_home, id, is_knockout } = match
    const isGameTied = !getWinnerSide(result_home, result_away)
    const showExtraTime = 
        (is_done && isGameTied && is_knockout)
        || (!is_done && isGameTied && is_knockout && full_result_home !== null && full_result_home >= 0 && full_result_away !== null && full_result_away >= 0 )
    const showQualifier = is_done && isGameTied && is_knockout

    const models: (RowModel | TableModel)[] = [
        ...( true || is_done ? [
            {
                id: '90min',
                home: result_home,
                away: result_away,
                delimiter: (showQualifier || showExtraTime) ? '90\'' : '',
            },
            ...(showExtraTime ? [
                {
                    id: '120min',
                    home: showQualifier ? full_result_home : `(${full_result_home})`,
                    away: showQualifier ? full_result_away : `(${full_result_away})`,
                    delimiter: showQualifier ? '120\'' : '',
                },
            ] : []),
            ...(showQualifier ? [
                {
                    id: 'qualifier',
                    home: winner_side === WinnerSide.Home ? '✌️' : '',
                    away: winner_side === WinnerSide.Away ? '✌️' : '',
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
        <div className={`LB-GameHeader ${tournamentClass} ${onClick ? 'GameHeader-clickable' : ''}`} onClick={onClick}>
            <CustomTable
                models={models}
                cells={cells}
            />
        </div>
    )
}


export default GameHeader
