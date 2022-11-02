import React from 'react'
import { Route, Switch } from 'react-router-dom'
import InviteFriends from '../../inviteFriends/InviteFriends';
import ManageContestantsProvider from '../../manageContestants/ManageContestantsProvider';
import TournamentConfigPage from '../../tournamentConfig';
import ScoresConfigPage from '../../tournamentConfig/scores/ScoresConfigPageProvider';


function TournamentAdminRoutes({children}) {
    return (
        <Switch>
            <Route path='/tournament-scores-config' component={ScoresConfigPage} />
            <Route path='/tournament-config' component={TournamentConfigPage} />
            <Route path='/contestants' component={ManageContestantsProvider} />
            <Route path='/invite-friends' component={InviteFriends} />
            <Route>
                {children}
            </Route>
        </Switch>
    )
}


export default TournamentAdminRoutes
