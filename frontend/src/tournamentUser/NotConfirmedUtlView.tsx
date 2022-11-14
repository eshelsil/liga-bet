import React from 'react'
import { UtlWithTournament } from '../types'

interface Props {
    currentUTL: UtlWithTournament
}

function NotConfirmedUtlView({ currentUTL }: Props) {
    const { tournament } = currentUTL
    const { name: tournamentName } = tournament
    return (
        <div>
            <h2 className='LB-TitleText'>תיכף זה מתחיל...</h2>
            <div className='LB-FloatingFrame' style={{ marginTop: 24 }}>
                <h4>נרשמת לטורניר "{tournamentName}"</h4>
                <h4>ברגע שמנהלי הטורניר יאשרו אותך, תוכל להתחיל לשחק</h4>
            </div>
        </div>
    )
}

export default NotConfirmedUtlView
