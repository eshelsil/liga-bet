import React from 'react'
import { Link } from '@mui/material'
import useGoTo from '../../hooks/useGoTo'
import './style.scss'

function AdminTools() {
    const { goToAdminInviteTournamentAdmin } = useGoTo()
    return (
        <div className='LB-AdminTools'>
            <h1>כלים של אדמין</h1>
            <Link onClick={goToAdminInviteTournamentAdmin}>שלח הזמנה לפתיחת טורניר</Link>
        </div>
    )
}


export default AdminTools
