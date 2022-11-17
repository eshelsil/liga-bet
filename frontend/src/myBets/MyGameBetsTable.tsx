import React from 'react'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import { MatchBetWithRelations } from '../types'
import GameBetsTable from './GameBetsTable'


const MyGameBetsTable = ({ bets }: { bets: MatchBetWithRelations[] }) => {
    const tournamentClass = useTournamentThemeClass();

    return (
        <div className='LB-MyGameBetsTable LB-MyBetsSection'>
            <div className={`MyBetsSection-header ${tournamentClass}`}>
                <h4 className='MyBetsSection-title'>{'משחקים'}</h4>
            </div>
            <GameBetsTable
                bets={bets}
                headers={{
                    bet: 'הניחוש שלך',
                    result: 'תוצאה בפועל',
                }}
            />
        </div>
    )
}

export default MyGameBetsTable
