import React from 'react'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import useGoTo from '../hooks/useGoTo'
import './AdminDefaultView.scss'

function AdminDefaultView() {
    const { t } = useTranslation('admin')
    const { goToJoinTournament, goToCreateTournament } = useGoTo()
    return (
        <div className='LigaBet-AdminDefaultView'>
            <h1 className={'title LB-TitleText'}>{t('defaultView.title')}</h1>
            <div className='buttonsContainer'>
                <Button variant="contained" color="primary" onClick={goToJoinTournament}>
                    {t('defaultView.joinExistingTournament')}
                </Button>
                <Button variant="contained" color="primary" onClick={goToCreateTournament}>
                    {t('defaultView.createNewTournament')}
                </Button>
            </div>
        </div>
    )
}


export default AdminDefaultView
