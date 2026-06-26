import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import { GroupRankBetWithRelations } from '../types'
import GroupRankBetsTable from './GroupRankBetsTable'

const MyGroupPositionBetsTable = ({
    bets,
}: {
    bets: GroupRankBetWithRelations[]
}) => {
    const { t } = useTranslation('myBets')
    const tournamentClass = useTournamentThemeClass();

    return (
        <div className='LB-MyGroupRankBetsTable LB-MyBetsSection'>
            <div className={`MyBetsSection-header ${tournamentClass}`}>
                <h4 className='MyBetsSection-title'>{t('sections.groupRanks')}</h4>
            </div>
            <GroupRankBetsTable
                bets={bets}
                headers={{
                    result: t('headers.actualResult'),
                }}
            />
        </div>
    )
}

export default MyGroupPositionBetsTable
