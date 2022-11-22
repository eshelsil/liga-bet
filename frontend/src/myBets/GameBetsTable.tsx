import React from 'react'
import CustomTable from '../widgets/Table/CustomTable'
import { MatchBetWithRelations } from '../types'
import { isGameLive, SHORT_DATE_FORMAT } from '../utils'
import dayjs from 'dayjs'
import MatchResultView from '../widgets/MatchResult'
import { orderBy } from 'lodash'


interface Props {
    bets: MatchBetWithRelations[],
    headers?: {
        bet?: string,
        result?: string,
    },
    dropColumns?: {
        date?: boolean
    }
    showLive?: boolean
}

const GameBetsTable = ({ bets, headers, dropColumns, showLive }: Props) => {
    const cells = [
		{
			id: 'id',
			header: 'מזהה',
			classes: {
                header: 'admin',
                cell: 'admin',
            },
			getter: (bet: MatchBetWithRelations) => bet.id,
		},
		...(!dropColumns?.date
            ? [{
                    id: 'date',
                    header: 'תאריך',
                    classes: {
                        header: 'dateCell',
                    },
                    getter: (bet: MatchBetWithRelations) => dayjs(bet.relatedMatch.start_time).format(SHORT_DATE_FORMAT),
            }] : []
        ),
		{
			id: 'bet',
			header: headers?.bet ?? 'ניחוש',
            classes: {
                cell: 'alignToTop',
            },
			getter: (bet: MatchBetWithRelations) => (
                <MatchResultView
                    home={{
                        team: bet.relatedMatch.home_team,
                        score: bet.result_home,
                    }}
                    away={{
                        team: bet.relatedMatch.away_team,
                        score: bet.result_away,
                    }}
                    qualifier={bet.winner_side}
                />
            ),
		},
		{
			id: 'result',
			header: headers?.bet ?? 'תוצאה',
			getter: (bet: MatchBetWithRelations) => (<>
                {showLive || bet.relatedMatch.is_done ? (
                    <MatchResultView
                        home={{
                            team: bet.relatedMatch.home_team,
                            score: bet.relatedMatch.result_home,
                        }}
                        away={{
                            team: bet.relatedMatch.away_team,
                            score: bet.relatedMatch.result_away,
                        }}
                        qualifier={bet.winner_side ? bet.relatedMatch.winner_side : undefined}
                    />
                ) : null}
            </>),
		},
		{
			id: 'score',
			header: 'נק\'',
            classes: {
                cell: 'scoreCell'
            },
			getter: (bet: MatchBetWithRelations) => bet.score,
		},
    ]

    const getRowClassName = (model: MatchBetWithRelations) => {
        return (showLive && isGameLive(model.relatedMatch)) ? 'GameBetsTable-live' : ''
    }

    const models = orderBy(bets, [bet => bet.relatedMatch.start_time], ['desc'])

    return (
        <div className='LB-GameBetsTable'>
            <CustomTable models={models} cells={cells} getRowClassName={getRowClassName} />
        </div>
    )
}

export default GameBetsTable
