import React from 'react'
import { useSelector } from 'react-redux'
import { CurrentUser } from '../_selectors'
import { UserPermissions } from '../types'
import CreateNewTournament from './CreateNewTournament'
import JoinTournament from './JoinTournament'
import AdminDefaultView from '../admin/AdminDefaultView'
import './style.scss'

function UserWithNoTournamentsView() {
    const user = useSelector(CurrentUser);

    return (<>
        {user.permissions === UserPermissions.Admin && (
            <AdminDefaultView />
        )}
        {user.permissions === UserPermissions.TournamentAdmin && (
            <CreateNewTournament />
            )}
        {user.permissions === UserPermissions.User && (
            <JoinTournament />
        )}
    </>)
}

export default UserWithNoTournamentsView
