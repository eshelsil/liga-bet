import React, { ReactNode } from 'react'
import { Route, Switch } from 'react-router-dom'
import { isUtlConfirmed } from '../utils'
import NoConfirmationView from './NoConfirmationView'
import { UtlWithTournament } from '../types'
import UTLPage from '../myUTL';

interface Props {
    currentUtl: UtlWithTournament
    children: ReactNode
}

function SelectedUTLController({ currentUtl, children }: Props) {

    const hasSelectedUtl = !!currentUtl
    const utlConfirmed = hasSelectedUtl && isUtlConfirmed(currentUtl)
    return (
        <Switch>
            <Route path='/utl' component={UTLPage} />
            <Route>
                {hasSelectedUtl && (<>
                    {utlConfirmed ? (
                        children
                    ) : (
                        <NoConfirmationView currentUTL={currentUtl} />
                    )}
                </>)}
            </Route>
        </Switch>
    )
}

export default SelectedUTLController
