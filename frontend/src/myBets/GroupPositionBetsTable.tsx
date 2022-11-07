import React from 'react'
import { useTournamentThemeClass } from '../hooks/useTournamentTheme'
import { GroupRankBetWithRelations } from '../types'
import CustomTable from '../widgets/Table/CustomTable'
import GroupStandingsResult from './GroupStandingsResult'

const GroupPositionBetsTable = ({
    bets,
}: {
    bets: GroupRankBetWithRelations[]
}) => {
    const tournamentClass = useTournamentThemeClass();

    const cells = [
		{
			id: 'id',
			header: 'מזהה',
			classes: {
                header: 'admin',
                cell: 'admin',
            },
			getter: (bet: GroupRankBetWithRelations) => bet.id,
		},
		{
			id: 'bet',
			header: 'הניחוש שלך',
            classes: {
                cell: 'alignToTop'
            },
			getter: (bet: GroupRankBetWithRelations) => (
                <GroupStandingsResult
                    standings={bet.standings}
                    name={bet.relatedGroup.name}
                />
            ),
		},
		{
			id: 'result',
			header: 'תוצאה בפועל',
			getter: (bet: GroupRankBetWithRelations) => (<>
                {bet.relatedGroup.isDone && (
                    <GroupStandingsResult
                        standings={bet.relatedGroup.standings}
                        name={bet.relatedGroup.name}
                    />
                )}
            </>),
		},
		{
			id: 'score',
			header: 'נק\'',
			getter: (bet: GroupRankBetWithRelations) => bet.score,
		},
    ]
    return (
        <div className='LB-MyGroupRankBetsTable LB-MyBetsSection'>
            <div className={`MyBetsSection-header ${tournamentClass}`}>
                <h4 className='MyBetsSection-title'>{'דירוגי בתים'}</h4>
            </div>
            <CustomTable models={bets} cells={cells} />
        </div>
    )
}

export default GroupPositionBetsTable
