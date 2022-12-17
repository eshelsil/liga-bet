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




function AdminSetMvp() {
    const dispatch = useDispatch<AppDispatch>()
    const competitionId = useSelector(CurrentCompetitionId)
    const { goToAdminIndex } = useGoTo()
    const [mvp, setMvp] = useState<number>()

    const submit = async () => {
        await announceMvp(competitionId, mvp)
            .then(data => {
                (window as any).toastr["success"]('עודכן בהצלחה')
            })
    }

    useEffect(() => {
        if (competitionId) {
            dispatch(fetchAndStoreAllPlayers())
        }
    }, [competitionId])

    return (
        <div className='LB-AdminSetMvp'>
            <h2>הכרז על מצטיין טורניר</h2>
            <PlayerInput value={mvp} onChange={setMvp} />
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

export default AdminSetMvp 
