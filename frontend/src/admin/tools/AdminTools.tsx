import React from 'react'
import { Link } from '@mui/material'
import { useTranslation } from 'react-i18next'
import useGoTo from '../../hooks/useGoTo'
import { useHistory } from 'react-router-dom'
import './style.scss'

function AdminTools() {
    const { t } = useTranslation('admin')
    const history = useHistory()
    const { goToAdminInviteTournamentAdmin } = useGoTo()
    return (
        <div className='LB-AdminTools'>
            <h1 className='LB-TitleText'>{t('tools.title')}</h1>
            <div style={{marginTop: 20}}>
                <Link onClick={() => history.push('/admin/see-tournaments')}>{t('tools.seeTournaments')}</Link>
                <Link onClick={() => history.push('/admin/users')}>{t('tools.manageUsers')}</Link>
                <Link onClick={() => history.push('/admin/see-scorers')}>{t('tools.seeScorers')}</Link>
                <Link onClick={() => history.push('/admin/set-mvp')}>{t('tools.setMvp')}</Link>
                <Link onClick={() => history.push('/admin/fix-games-start-time')}>{t('tools.fixGamesStartTime')}</Link>
                <Link onClick={() => history.push('/admin/grant-nihusim')}>{t('tools.grantNihusim')}</Link>
                <Link onClick={() => history.push('/admin/update-side-tournament-games')}>{t('tools.updateSideTournament')}</Link>
                <Link onClick={goToAdminInviteTournamentAdmin}>{t('tools.sendTournamentAdminInvite')}</Link>
            </div>

        </div>
    )
}


export default AdminTools
