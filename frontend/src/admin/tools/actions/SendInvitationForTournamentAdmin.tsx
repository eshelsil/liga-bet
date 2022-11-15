import React, { useState } from 'react'
import { Button, TextField } from '@mui/material'
import { LoadingButton } from '../../../widgets/Buttons'
import useGoTo from '../../../hooks/useGoTo'
import { sendInvitationForTournamentAdmin } from '../../../api/admin'

function SendInvitationForTournamentAdmin() {
    const {goToAdminIndex} = useGoTo()
    const [email, setEmail] = useState('')

    const sendInvite = async() => {
        await sendInvitationForTournamentAdmin(email)
            .then(()=>{
                (window as any).toastr['success']('פעולה בוצעה בהצלחה')
            })
    }
    return (
        <div className='LB-InvitaionForTourAdmin'>
            <h3>הזמן מישהו להירשם כמנהל טורניר</h3>
            <h5>יקבל הרשאות שלמנהל טורניר מיד לאחר שירשם</h5>
            <h5>יקבל אימייל הזמנה לפתיחת טורניר</h5>
            <TextField
                label='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <div className='sendButton'>
                <LoadingButton action={sendInvite}>
                    שלח הזמנה
                </LoadingButton>
            </div>
            <div className='goBackButton'>
                <Button
                    variant='outlined'
                    color='primary'
                    onClick={goToAdminIndex}
                >
                    חזור
                </Button>
            </div>
        </div>
    )
}


export default SendInvitationForTournamentAdmin
