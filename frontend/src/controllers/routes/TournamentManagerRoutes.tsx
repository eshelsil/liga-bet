import React from 'react'
import { Route, Switch } from 'react-router-dom'
import InviteFriends from '../../inviteFriends/InviteFriends';
import ManageContestantsProvider from '../../manageContestants/ManageContestantsProvider';


function TournamentManagerRoutes({children}) {
    return (
        <Switch>
            <Route path='/contestants' component={ManageContestantsProvider} />
            <Route path='/invite-friends' component={InviteFriends} />
            <Route>
                {children}
            </Route>
        </Switch>
    )
}


export default TournamentManagerRoutes
