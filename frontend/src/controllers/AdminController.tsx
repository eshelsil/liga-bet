import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { useSelector } from 'react-redux';
import ManageUsers from '../manageUsers';
import { IsAdmin } from '../_selectors';
import AdminTools from '../admin/tools/AdminTools';
import AdminSeeTournaments from '../admin/tools/views/SeeTournaments';
import SendInvitationForTournamentAdmin from '../admin/tools/actions/SendInvitationForTournamentAdmin';
import AdminSeeGameGoalsData from '../admin/tools/views/SeeGameGoalsData';
import AdminSetMvp from '../admin/tools/views/AdminSetMvp';
import AdminGrantNihusim from '../admin/tools/views/AdminGrantNihusim';
import AdminUpdateSideTournament from '../admin/tools/views/UpdateSideTournament';
import AdminFixGamesStartTime from '@/admin/tools/views/AdminFixGamesStartTime';


function AdminController({children}) {
    const isAdmin = useSelector(IsAdmin)
    return (
        <>
            {isAdmin && (
                <Switch>
                    <Route path='/admin' component={AdminTools}>
                        <div className='LB-AdminViewContainer'>
                            <Switch>
                                <Route path='/admin/users' component={ManageUsers} />
                                <Route path='/admin/invite-tournament-admin' component={SendInvitationForTournamentAdmin} />
                                <Route path='/admin/see-tournaments' component={AdminSeeTournaments} />
                                <Route path='/admin/see-scorers' component={AdminSeeGameGoalsData} />
                                <Route path='/admin/set-mvp' component={AdminSetMvp} />
                                <Route path='/admin/fix-games-start-time' component={AdminFixGamesStartTime} />
                                <Route path='/admin/grant-nihusim' component={AdminGrantNihusim} />
                                <Route path='/admin/update-side-tournament-games' component={AdminUpdateSideTournament} />
                                <Route>
                                    <AdminTools />
                                </Route>
                            </Switch>
                        </div>
                    </Route>
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


export default AdminController
