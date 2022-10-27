import React from 'react'
import { Route, Switch } from 'react-router-dom'
import UTLPage from '../../myUTL';

function NoUTLsRoutes({children}) {
    return (
        <Switch>
            <Route path='/utls' component={UTLPage} />
            <Route>
                {children}
            </Route>
        </Switch>
    )
}


export default NoUTLsRoutes
