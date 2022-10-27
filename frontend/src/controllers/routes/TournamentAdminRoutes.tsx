import React from 'react'
import { Route, Switch } from 'react-router-dom'
import ManageContestantsProvider from '../../manageContestants/ManageContestantsProvider';
import TournamentConfigPage from '../../tournamentConfig';

function TournamentAdminRoutes({children}) {
    return (
        <Switch>
            <Route path='/tournament-config' component={TournamentConfigPage} />
            <Route path='/contestants' component={ManageContestantsProvider} />                                    
            <Route>
                {children}
            </Route>
        </Switch>
    )
}


export default TournamentAdminRoutes
