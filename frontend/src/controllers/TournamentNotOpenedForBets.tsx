import React from 'react'
import { useSelector } from 'react-redux'
import { CurrentTournament, CurrentTournamentOwner } from '../_selectors'

function TournamentNotOpenedForBets() {
    const tournament = useSelector(CurrentTournament)
    const owner = useSelector(CurrentTournamentOwner)
    return (
        <div>
            <h2>{tournament?.name}</h2>
            <h4 style={{ marginTop: 24 }}>מחכים שמנהל הטורניר (המכונה אצליכם בחברה "{owner?.name}") יפתח את הטורניר לניחושים</h4>
        </div>
    )
}

export default TournamentNotOpenedForBets
