import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { useSelector } from 'react-redux';
import ManageUsers from '../../manageUsers';
import { IsAdmin } from '../../_selectors';
import AdminTools from '../../admin/tools/AdminTools';
import SendInvitationForTournamentAdmin from '../../admin/tools/actions/SendInvitationForTournamentAdmin';


function AdminRoutes({children}) {
    const isAdmin = useSelector(IsAdmin)
    return (
        <>
            {isAdmin && (
                <Switch>
                    <Route path='/admin/users' component={ManageUsers} />
                    <Route path='/admin/invite-tournament-admin' component={SendInvitationForTournamentAdmin} />
                    <Route path='/admin' component={AdminTools} />
                    <Route>
                        {children}
                    </Route>
                </Switch>
            )}
            {!isAdmin && (<>
                {children}
            </>)}
        </>
    )
}


export default AdminRoutes
