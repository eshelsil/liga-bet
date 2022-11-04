import React, { ReactNode } from 'react'
import { TournamentStatus, UtlRole, UtlWithTournament } from '../types'
import InitialDataFetcher from '../initialDataFetcher/InitialDataFetcher';
import TournamentNotOpenedForBets from './TournamentNotOpenedForBets'
import TournamentAdminRoutes from './routes/TournamentAdminRoutes'
import TournamentManagerRoutes from './routes/TournamentManagerRoutes';



interface Props {
    currentUtl: UtlWithTournament
    children: ReactNode
}

function OpenTournamentController({ currentUtl, children }: Props){
    const isStatusInitial = currentUtl.tournament.status === TournamentStatus.Initial;
    const isTournamentAdmin = currentUtl.role === UtlRole.Admin;
    const showBetsAreNotOpenedYet = isStatusInitial && !isTournamentAdmin

    return (<>
        {showBetsAreNotOpenedYet && (
            <TournamentNotOpenedForBets />
        )}
        {!showBetsAreNotOpenedYet && (<>
            {children}
        </>)}
    </>)
}


function ConfirmedUtlController({ currentUtl, children }: Props) {

    const isTournamentAdmin = currentUtl.role === UtlRole.Admin
    const isManager = currentUtl.role === UtlRole.Manager
    const hasManagerPermissions = isTournamentAdmin || isManager

    return (
        <InitialDataFetcher>
            {hasManagerPermissions && (
                <TournamentManagerRoutes>
                    {isTournamentAdmin && (
                        <TournamentAdminRoutes>
                            {children}
                        </TournamentAdminRoutes>
                    )}
                    {!isTournamentAdmin && (<>
                        {children}
                    </>)}
                </TournamentManagerRoutes>
            )}
            {!hasManagerPermissions && (
                <>
                    {children}
                </>
            )}
        </InitialDataFetcher>
    )
}

export default ConfirmedUtlController
