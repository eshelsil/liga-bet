import React from 'react'
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
    return (
        <div className="LigaBet-RejectedView">
            <h2 className='LB-TitleText'>לא נעים, אבל...</h2>
            <div className='LB-FloatingFrame'>
                <h4 className="RejectedView-msg">
                    השתתפותך בטורניר "{tournamentName}" נדחתה ע"י משתתפי הטורניר
                </h4>
                <div className={'RejectedView-leaveButtonContainer'}>
                    <Button variant="contained" color="error" onClick={onLeave}>
                        {' '}
                        עזוב את הטורניר{' '}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default RejectedView
