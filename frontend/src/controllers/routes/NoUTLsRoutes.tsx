import React from 'react'
import { Route, Switch } from 'react-router-dom'
import CreateNewTournament from '../../tournamentUser/CreateNewTournament'
import JoinTournament from '../../tournamentUser/JoinTournament'
import AdminRoutes from './AdminRoutes';
import MyProfile from '../../myProfile/MyProfile';


function NoUTLsRoutes({children}) {
    return (
        <AdminRoutes>
            <Switch>
                <Route path="/profile" component={MyProfile} />
                <Route path="/join-tournament/:tournamentId?" component={JoinTournament} />
                <Route path="/create-tournament" component={CreateNewTournament} />
                <Route>
                    {children}
                </Route>
            </Switch>
        </AdminRoutes>
    )
}


export default NoUTLsRoutes
