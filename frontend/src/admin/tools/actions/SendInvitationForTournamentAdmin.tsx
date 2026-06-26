import React, { useState } from 'react'
import { Button, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { LoadingButton } from '../../../widgets/Buttons'
import useGoTo from '../../../hooks/useGoTo'
import { sendInvitationForTournamentAdmin } from '../../../api/admin'

function SendInvitationForTournamentAdmin() {
    const { t } = useTranslation('admin')
    const {goToAdminIndex} = useGoTo()
    const [email, setEmail] = useState('')

    const sendInvite = async() => {
        await sendInvitationForTournamentAdmin(email)
            .then(()=>{
                (window as any).toastr['success'](t('toasts.actionSucceeded'))
            })
    }
    return (
        <div className='LB-InvitaionForTourAdmin'>
            <h3>{t('sendInvitation.title')}</h3>
            <h5>{t('sendInvitation.subtitle1')}</h5>
            <h5>{t('sendInvitation.subtitle2')}</h5>
            <TextField
                label='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <div className='sendButton'>
                <LoadingButton action={sendInvite}>
                    {t('sendInvitation.sendInvite')}
                </LoadingButton>
            </div>
            <div className='goBackButton'>
                <Button
                    variant='outlined'
                    color='primary'
                    onClick={goToAdminIndex}
                >
                    {t('buttons.back')}
                </Button>
            </div>
        </div>
    )
}


export default SendInvitationForTournamentAdmin
