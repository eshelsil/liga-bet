import React from 'react'
import { useSelector } from 'react-redux'
import { CurrentUser } from '../_selectors'
import { UserPermissions } from '../types'
import CreateNewTournament from './CreateNewTournament'
import JoinTournament from './JoinTournament'
import AdminDefaultView from '../admin/AdminDefaultView'
import './style.scss'

function UserWithNoTournamentsView({
    isMissingUtl
} : {
    isMissingUtl: boolean
}) {
    const user = useSelector(CurrentUser);

    const showCreateView = isMissingUtl || user.permissions === UserPermissions.TournamentAdmin
    const showAdminView = !showCreateView && user.permissions === UserPermissions.Admin
    const showJoinView = !showCreateView && !showAdminView

    return (<>
        {showAdminView && (
            <AdminDefaultView />
        )}
        {showCreateView && (
            <CreateNewTournament />
        )}
        {showJoinView && (
            <JoinTournament />
        )}
    </>)
}

export default UserWithNoTournamentsView
