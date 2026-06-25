import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import { MatchBetWithRelations } from '../types'
import GameBetsTable from './GameBetsTable'


const MyGameBetsTable = ({ bets }: { bets: MatchBetWithRelations[] }) => {
    const { t } = useTranslation('myBets')
    const tournamentClass = useTournamentThemeClass();

    return (
        <div className='LB-MyGameBetsTable LB-MyBetsSection'>
            <div className={`MyBetsSection-header ${tournamentClass}`}>
                <h4 className='MyBetsSection-title'>{t('sections.matches')}</h4>
            </div>
            <GameBetsTable
                bets={bets}
                headers={{
                    result: t('headers.actualResult'),
                }}
            />
        </div>
    )
}

export default MyGameBetsTable
