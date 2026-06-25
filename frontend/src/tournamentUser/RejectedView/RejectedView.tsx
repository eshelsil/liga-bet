import React from 'react'
import { useTranslation } from 'react-i18next'
import { UtlWithTournament } from '../../types'
import { Button } from '@mui/material'
import './RejectedView.scss'

interface Props {
    currentUTL: UtlWithTournament
    onLeave: () => void
}

function RejectedView({ currentUTL, onLeave }: Props) {
    const { tournament } = currentUTL
    const { name: tournamentName } = tournament
    const { t } = useTranslation('tournamentUser')
    return (
        <div className="LigaBet-RejectedView">
            <h2 className='LB-TitleText'>{t('rejected.title')}</h2>
            <div className='LB-FloatingFrame'>
                <h4 className="RejectedView-msg">
                    {t('rejected.message', { name: tournamentName })}
                </h4>
                <div className={'RejectedView-leaveButtonContainer'}>
                    <Button variant="contained" color="error" onClick={onLeave}>
                        {' '}
                        {t('rejected.leaveButton')}{' '}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default RejectedView
