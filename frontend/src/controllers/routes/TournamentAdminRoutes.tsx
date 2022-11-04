import React from 'react'
import { Route, Switch } from 'react-router-dom'
import TournamentConfigPage from '../../tournamentConfig';
import ScoresConfigPage from '../../tournamentConfig/scores/ScoresConfigPageProvider';


function TournamentAdminRoutes({children}) {
    return (
        <Switch>
            <Route path='/tournament-scores-config' component={ScoresConfigPage} />
            <Route path='/tournament-config' component={TournamentConfigPage} />
            <Route>
                {children}
            </Route>
        </Switch>
    )
}


export default TournamentAdminRoutes
