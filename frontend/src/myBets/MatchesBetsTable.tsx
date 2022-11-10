import React from 'react'
import CustomTable from '../widgets/Table/CustomTable'
import { useTournamentThemeClass } from '../hooks/useTournamentTheme'
import { MatchBetWithRelations } from '../types'
import { SHORT_DATE_FORMAT } from '../utils'
import dayjs from 'dayjs'
import MatchResultView from '../widgets/MatchResult'


const MatchesBetsTable = ({ bets }: { bets: MatchBetWithRelations[] }) => {
    const tournamentClass = useTournamentThemeClass();
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
		{
			id: 'date',
			header: 'תאריך',
            classes: {
                header: 'dateCell',
            },
			getter: (bet: MatchBetWithRelations) => dayjs(bet.relatedMatch.start_time).format(SHORT_DATE_FORMAT),
		},
		{
			id: 'bet',
			header: 'הניחוש שלך',
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
			header: 'תוצאה בפועל',
			getter: (bet: MatchBetWithRelations) => (<>
                {bet.relatedMatch.is_done && (
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
                )}
            </>),
		},
		{
			id: 'score',
			header: 'נק\'',
			getter: (bet: MatchBetWithRelations) => bet.score,
		},
    ]

    return (
        <div className='LB-MyGameBetsTable LB-MyBetsSection'>
            <div className={`MyBetsSection-header ${tournamentClass}`}>
                <h4 className='MyBetsSection-title'>{'משחקים'}</h4>
            </div>
            <CustomTable models={bets} cells={cells} />
        </div>
    )
}

export default MatchesBetsTable
