import React from 'react'
import { Link } from '@mui/material'
import useGoTo from '../../hooks/useGoTo'
import './style.scss'
import AppLink from '../../appLinks/AppLink'

function AdminTools() {
    const { goToAdminInviteTournamentAdmin } = useGoTo()
    return (
        <div className='LB-AdminTools'>
            <h1 className='LB-TitleText'>כלים של אדמין</h1>
            <Link onClick={goToAdminInviteTournamentAdmin}>שלח הזמנה לפתיחת טורניר</Link>
            <div style={{marginTop: 20}}>
                <AppLink {...{
                    id: 'manageUsers',
                    path: '/admin/users',
                    label: 'Manage users',
                    isAdminView: true,
                }} />
            </div>

        </div>
    )
}


export default AdminTools
