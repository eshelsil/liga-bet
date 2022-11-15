import React from 'react'
import { Link } from '@mui/material'
import useGoTo from '../../hooks/useGoTo'
import { useHistory } from 'react-router-dom'
import './style.scss'

function AdminTools() {
    const history = useHistory()
    const { goToAdminInviteTournamentAdmin } = useGoTo()
    return (
        <div className='LB-AdminTools'>
            <h1 className='LB-TitleText'>כלים של אדמין</h1>
            <div style={{marginTop: 20}}>
                <Link onClick={() => history.push('/admin/see-tournaments')}>צפה בטורנירים</Link>
                <Link onClick={() => history.push('/admin/users')}>Manage users</Link>
                <Link onClick={goToAdminInviteTournamentAdmin}>שלח הזמנה לפתיחת טורניר</Link>
            </div>

        </div>
    )
}


export default AdminTools
