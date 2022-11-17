import React from 'react'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import { QuestionBetWithRelations } from '../types'
import SpecialBetsTable from './SpecialBetsTable'


const MySpecialBetsTable = ({ bets }: { bets: QuestionBetWithRelations[] }) => {
    const tournamentClass = useTournamentThemeClass();
	
    return (
        <div className='LB-MyQuestionBetsTable LB-MyBetsSection'>
            <div className={`MyBetsSection-header ${tournamentClass}`}>
                <h4 className='MyBetsSection-title'>{'שאלות מיוחדות'}</h4>
            </div>
            <SpecialBetsTable
                bets={bets}
                headers={{
                    bet: 'הניחוש שלך',
                    result: 'תוצאה בפועל',
                }}
            />
        </div>
    )
}

export default MySpecialBetsTable
