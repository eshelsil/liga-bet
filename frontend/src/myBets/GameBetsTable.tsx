import React from 'react'
import { useTranslation } from 'react-i18next'
import CustomTable from '../widgets/Table/CustomTable'
import { MatchBetWithRelations } from '../types'
import { ENG_SHORT_DATE_FORMAT, getQualifierSide, isGameLive, SHORT_DATE_FORMAT } from '../utils'
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
    const { t, i18n } = useTranslation('myBets')
    const cells = [
		{
			id: 'id',
			header: t('columns.id'),
			classes: {
                header: 'admin',
                cell: 'admin',
            },
			getter: (bet: MatchBetWithRelations) => bet.id,
		},
		...(!dropColumns?.date
            ? [{
                    id: 'date',
                    header: t('columns.date'),
                    classes: {
                        header: 'dateCell',
                    },
                    getter: (bet: MatchBetWithRelations) => dayjs(bet.relatedMatch.start_time).format(
                        i18n.language === 'he' ?  SHORT_DATE_FORMAT:ENG_SHORT_DATE_FORMAT
                    ),
            }] : []
        ),
		{
			id: 'bet',
			header: headers?.bet ?? t('columns.bet'),
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
                    isKnockout={bet.relatedMatch.is_knockout}
                    qualifier={bet.winner_side}
                    isAutoBet={bet.is_auto_bet}
                />
            ),
		},
		{
			id: 'result',
			header: headers?.bet ?? t('columns.result'),
			getter: (bet: MatchBetWithRelations) => (<>
                {showLive || bet.relatedMatch.is_done ? (
                    <MatchResultView
                        home={{
                            team: bet.relatedMatch.home_team,
                            score: bet.relatedMatch.result_home,
                            fullScore: bet.relatedMatch.full_result_home,
                        }}
                        away={{
                            team: bet.relatedMatch.away_team,
                            score: bet.relatedMatch.result_away,
                            fullScore: bet.relatedMatch.full_result_away,
                        }}
                        isKnockout={bet.relatedMatch.is_knockout}
                        qualifier={getQualifierSide(bet.relatedMatch)}
                    />
                ) : null}
            </>),
		},
		{
			id: 'score',
			header: t('columns.score'),
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
