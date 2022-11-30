import React from 'react'
import { GroupRankBetWithRelations, Team } from '../types'
import CustomTable from '../widgets/Table/CustomTable'
import GroupStandingsResult from '../widgets/GroupStandings'
import { orderBy } from 'lodash'


interface Props {
    bets: GroupRankBetWithRelations[],
    headers?: {
        bet?: string,
        result?: string,
    },
    liveStandings?: Record<number, Team[]>
    showLive?: boolean
}

const GroupRankBetsTable = ({
    bets,
    headers,
    showLive,
    liveStandings = {},
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
			getter: (bet: GroupRankBetWithRelations) => {
                const liveGroupRank = showLive ? liveStandings[bet.relatedGroup.id] : undefined
                return (<>
                    {(!!liveGroupRank || bet.relatedGroup.isDone) && (
                        <GroupStandingsResult
                            standings={liveGroupRank ?? bet.relatedGroup.standings}
                            name={bet.relatedGroup.name}
                        />
                    )}
                </>)
            },
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

    const getRowClassName = (model: GroupRankBetWithRelations) => {
        return (showLive && liveStandings[model.relatedGroup.id]) ? 'GroupRankBetsTable-live' : ''
    }

    return (
        <div className='LB-GroupRankBetsTable'>
            <CustomTable
                models={models}
                cells={cells}
                getRowClassName={getRowClassName}
            />
        </div>
    )
}

export default GroupRankBetsTable
