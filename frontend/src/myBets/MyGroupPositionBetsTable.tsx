import React from 'react'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import { GroupRankBetWithRelations } from '../types'
import GroupRankBetsTable from './GroupRankBetsTable'

const MyGroupPositionBetsTable = ({
    bets,
}: {
    bets: GroupRankBetWithRelations[]
}) => {
    const tournamentClass = useTournamentThemeClass();

    return (
        <div className='LB-MyGroupRankBetsTable LB-MyBetsSection'>
            <div className={`MyBetsSection-header ${tournamentClass}`}>
                <h4 className='MyBetsSection-title'>{'דירוגי בתים'}</h4>
            </div>
            <GroupRankBetsTable
                bets={bets}
                headers={{
                    result: 'תוצאה בפועל',
                }}
            />
        </div>
    )
}

export default MyGroupPositionBetsTable
