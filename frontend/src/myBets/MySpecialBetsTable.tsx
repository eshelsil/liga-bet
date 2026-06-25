import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import { QuestionBetWithRelations } from '../types'
import SpecialBetsTable from './SpecialBetsTable'


const MySpecialBetsTable = ({ bets }: { bets: QuestionBetWithRelations[] }) => {
    const { t } = useTranslation('myBets')
    const tournamentClass = useTournamentThemeClass();
	
    return (
        <div className='LB-MyQuestionBetsTable LB-MyBetsSection'>
            <div className={`MyBetsSection-header ${tournamentClass}`}>
                <h4 className='MyBetsSection-title'>{t('sections.specialQuestions')}</h4>
            </div>
            <SpecialBetsTable
                bets={bets}
                headers={{
                    result: t('headers.actualResult'),
                }}
            />
        </div>
    )
}

export default MySpecialBetsTable
