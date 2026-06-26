import React from 'react'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import useGoTo from '../../../hooks/useGoTo'
import { CurrentTournament } from '../../../_selectors'
import { useSelector } from 'react-redux'
import { LoadingButton } from '../../../widgets/Buttons'
import { markUpdateGameStartTime } from '../../../api/admin'




function AdminFixGamesStartTime() {
    const { t } = useTranslation('admin')
    const tournament = useSelector(CurrentTournament)
    const { goToAdminIndex } = useGoTo()
    const isOn = !!tournament?.competition?.config?.update_upcoming_games_start_time

    const submit = async () => {
        await markUpdateGameStartTime(tournament.id)
            .then(data => {
                (window as any).toastr["success"](t('toasts.updatedSuccessfully'))
            })
    }

    return (
        <div className='LB-AdminSetMvp'>
            <h2>{t('fixGamesStartTime.title')}</h2>
            <h5>{t('fixGamesStartTime.currentState', { state: isOn ? t('fixGamesStartTime.on') : t('fixGamesStartTime.off') })}</h5>
            <LoadingButton action={submit} style={{marginTop: 24}}>
                {t('buttons.update')}
            </LoadingButton>
            <div className='goBackButton'>
                <Button
                    variant='outlined'
                    color='primary'
                    onClick={goToAdminIndex}
                    style={{marginTop: 24}}
                >
                    {t('buttons.back')}
                </Button>
            </div>
        </div>
    )
}

export default AdminFixGamesStartTime 
