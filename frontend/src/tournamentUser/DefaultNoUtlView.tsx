import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@mui/material'
import useGoTo from '../hooks/useGoTo'

function DefaultNoUtlView() {
    const { goToJoinTournament, goToCreateTournament } = useGoTo()
    const { t } = useTranslation('tournamentUser')
    return (
        <div className='LB-DefaultNoUtlView'>
            <h1 className={'title LB-TitleText'}>{t('default.welcome')}</h1>
            <div className='buttonsContainer'>
                <Button variant="contained" color="primary" onClick={goToJoinTournament}>
                    {t('default.joinExisting')}
                </Button>
                <Button variant="contained" color="primary" onClick={goToCreateTournament}>
                    {t('default.createNew')}
                </Button>
            </div>
        </div>
    )
}


export default DefaultNoUtlView
