import React from 'react'
import { GroupRankBetWithRelations } from '../types'
import CustomTable from '../widgets/Table/CustomTable'
import GroupStandingsResult from '../widgets/GroupStandings'
import { orderBy } from 'lodash'


interface Props {
    bets: GroupRankBetWithRelations[],
    headers?: {
        bet?: string,
        result?: string,
    },
}

const GroupRankBetsTable = ({
    bets,
    headers,
}: Props) => {

    const models = orderBy(bets, bet => bet.relatedGroup.name)

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
			header: headers?.bet ?? 'ניחוש',
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
			header: headers?.result ?? 'תוצאה',
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
            classes: {
                cell: 'scoreCell',
            },
			getter: (bet: GroupRankBetWithRelations) => bet.score,
		},
    ]
    return (
        <div className='LB-GroupRankBetsTable'>
            <CustomTable models={models} cells={cells} />
        </div>
    )
}

export default GroupRankBetsTable
