import React, { ReactNode } from 'react'
import CustomTable from '../widgets/Table/CustomTable'
import { Match, WinnerSide } from '../types'
import { Model as TableModel } from '../widgets/Table';
import TeamWithFlagVertical from '../widgets/TeamFlag/TeamWithFlagVertical'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import { calcTotalTwoLegsAggregation, getWinnerSide, isGameSecondLeg } from '../utils';


interface RowModel {
    id: string,
    home?: ReactNode,
    delimiter?: ReactNode,
    away?: ReactNode,
}

function GameHeader({ match, onClick }: { match: Match, onClick?: () => void }) {
    const tournamentClass = useTournamentThemeClass()
    const { home_team, away_team, start_time, is_done, winner_side, result_away, full_result_home, full_result_away, agg_result_away, agg_result_home, result_home, id, is_knockout, isTwoLeggedTie } = match
    const isGameTied = !getWinnerSide(result_home, result_away)
    const isSecondLeg = isGameSecondLeg(match)
    const hasExtraTimeScore = full_result_home !== null && full_result_home >= 0 && full_result_away !== null && full_result_away >= 0;
    const aggragatedData = calcTotalTwoLegsAggregation(match)

    const showExtraTime = is_knockout && hasExtraTimeScore
    const showAggregatedScore = isSecondLeg && aggragatedData
    const showQualifier = is_done && (isTwoLeggedTie ? isSecondLeg : (isGameTied && is_knockout))

    const models: (RowModel | TableModel)[] = [
        ...( true || is_done ? [
            {
                id: '90min',
                home: result_home,
                away: result_away,
                delimiter: (showExtraTime || showAggregatedScore) ? '90\'' : '',
            },
            ...(showExtraTime ? [
                {
                    id: '120min',
                    home: `(${full_result_home})`,
                    away: `(${full_result_away})`,
                    delimiter: '120\'',
                },
            ] : []),
            ...(showAggregatedScore ? [
                {
                    id: 'agg',
                    home: `(${aggragatedData.home})`,
                    away: `(${aggragatedData.away})`,
                    delimiter: 'סיכום',
                },
            ] : []),
        ] : [])
    ]
    const cells = [
        {
            id: 'home',
            header: (
                <>
                    <TeamWithFlagVertical
                        team={home_team}
                    />
                    {(showQualifier && (winner_side === WinnerSide.Home)) ? (
                        <div className='qualifierIndication'>✌️</div>
                    ) : null}
                </>
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
                <>
                    <TeamWithFlagVertical
                        team={away_team}
                    />
                    {(showQualifier && (winner_side === WinnerSide.Away)) ? (
                        <div className='qualifierIndication awaySide'>✌️</div>
                    ) : null}
                </>
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
