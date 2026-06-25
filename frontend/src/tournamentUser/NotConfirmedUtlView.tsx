import React from 'react'
import { useTranslation } from 'react-i18next'
import { UtlWithTournament } from '../types'

interface Props {
    currentUTL: UtlWithTournament
}

function NotConfirmedUtlView({ currentUTL }: Props) {
    const { tournament } = currentUTL
    const { name: tournamentName } = tournament
    const { t } = useTranslation('tournamentUser')
    return (
        <div>
            <h2 className='LB-TitleText'>{t('notConfirmed.title')}</h2>
            <div className='LB-FloatingFrame' style={{ marginTop: 24 }}>
                <h4>{t('notConfirmed.registered', { name: tournamentName })}</h4>
                <h4>{t('notConfirmed.waitingForApproval')}</h4>
            </div>
        </div>
    )
}

export default NotConfirmedUtlView
