import React from 'react'
import { Route, Switch } from 'react-router-dom'
import UTLPage from '../../myUTLs';
import UserPage from '../../myUser'
import CreateNewTournament from '../../tournamentUser/CreateNewTournament'
import JoinTournament from '../../tournamentUser/JoinTournament'
import ManageUsers from '../../manageUsers';


function NoUTLsRoutes({children}) {
    return (
        <Switch>
            <Route path="/user" component={UserPage} />
            <Route path='/utls' component={UTLPage} />
            <Route path='/admin/users' component={ManageUsers} />
            <Route path="/join-tournament/:tournamentId?" component={JoinTournament} />
            <Route path="/create-tournament" component={CreateNewTournament} />
            <Route>
                {children}
            </Route>
        </Switch>
    )
}


export default NoUTLsRoutes
