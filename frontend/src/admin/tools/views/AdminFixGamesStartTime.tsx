import React from 'react'
import { Button } from '@mui/material'
import useGoTo from '../../../hooks/useGoTo'
import { CurrentTournament } from '../../../_selectors'
import { useSelector } from 'react-redux'
import { LoadingButton } from '../../../widgets/Buttons'
import { markUpdateGameStartTime } from '../../../api/admin'




function AdminFixGamesStartTime() {
    const tournament = useSelector(CurrentTournament)
    const { goToAdminIndex } = useGoTo()
    const isOn = !!tournament?.competition?.config?.update_upcoming_games_start_time

    const submit = async () => {
        await markUpdateGameStartTime(tournament.id)
            .then(data => {
                (window as any).toastr["success"]('עודכן בהצלחה')
            })
    }

    return (
        <div className='LB-AdminSetMvp'>
            <h2>סמן את התחרות כ"דרוש תיקון זמני משחק"</h2>
            <h5>מצב כרגע: {isOn ? 'מופעל' : 'כבוי'}</h5>
            <LoadingButton action={submit} style={{marginTop: 24}}>
                עדכן
            </LoadingButton>
            <div className='goBackButton'>
                <Button
                    variant='outlined'
                    color='primary'
                    onClick={goToAdminIndex}
                    style={{marginTop: 24}}
                >
                    חזור
                </Button>
            </div>
        </div>
    )
}

export default AdminFixGamesStartTime 
