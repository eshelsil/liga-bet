import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import useGoTo from '../../../hooks/useGoTo'
import { CurrentCompetitionId } from '../../../_selectors'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { fetchAndStoreAllPlayers } from '../../../_actions/players'
import { AppDispatch } from '../../../_helpers/store'
import PlayerInput from '../../../openQuestionBets/PlayerInput'
import { LoadingButton } from '../../../widgets/Buttons'
import { announceMvp } from '../../../api/admin'
import { useTranslation } from 'react-i18next'




function AdminSetMvp() {
    const { t } = useTranslation('admin')
    const dispatch = useDispatch<AppDispatch>()
    const competitionId = useSelector(CurrentCompetitionId)
    const { goToAdminIndex } = useGoTo()
    const [mvp, setMvp] = useState<number>()

    const submit = async () => {
        await announceMvp(competitionId, mvp)
            .then(data => {
                (window as any).toastr["success"](t('toasts.updatedSuccessfully'))
            })
    }

    useEffect(() => {
        if (competitionId) {
            dispatch(fetchAndStoreAllPlayers())
        }
    }, [competitionId])

    return (
        <div className='LB-AdminSetMvp'>
            <h2>{t('setMvp.title')}</h2>
            <PlayerInput value={mvp} onChange={setMvp} />
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

export default AdminSetMvp 
