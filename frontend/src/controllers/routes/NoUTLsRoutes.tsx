import React from 'react'
import { Route, Switch } from 'react-router-dom'
import UTLPage from '../../myUTLs';
import UserPage from '../../myUser'
import CreateNewTournament from '../../tournamentUser/CreateNewTournament'
import JoinTournament from '../../tournamentUser/JoinTournament'
import AdminRoutes from './AdminRoutes';


function NoUTLsRoutes({children}) {
    return (
        <Switch>
            <AdminRoutes>
                <Route path="/user" component={UserPage} />
                <Route path='/utls' component={UTLPage} />
                <Route path="/join-tournament/:tournamentId?" component={JoinTournament} />
                <Route path="/create-tournament" component={CreateNewTournament} />
                <Route>
                    {children}
                </Route>
            </AdminRoutes>
        </Switch>
    )
}


export default NoUTLsRoutes
