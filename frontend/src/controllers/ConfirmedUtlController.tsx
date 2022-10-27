import React, { ReactNode } from 'react'
import { TournamentStatus, UtlRole, UtlWithTournament } from '../types'
import InitialDataFetcher from '../initialDataFetcher/InitialDataFetcher';
import TournamentNotOpenedForBets from './TournamentNotOpenedForBets'
import TournamentAdminRoutes from './routes/TournamentAdminRoutes'



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

    const isTournamentAdmin = currentUtl.role === UtlRole.Admin;

    return (
        <InitialDataFetcher>
            {isTournamentAdmin && (
                <TournamentAdminRoutes>
                    <OpenTournamentController currentUtl={currentUtl}>
                        {children}
                    </OpenTournamentController>
                </TournamentAdminRoutes>
            )}
            {!isTournamentAdmin && (
                <OpenTournamentController currentUtl={currentUtl}>
                    {children}
                </OpenTournamentController>
            )}
        </InitialDataFetcher>
    )
}

export default ConfirmedUtlController
