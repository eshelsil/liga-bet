import React, { ReactNode, useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { fetchAndStoreUtls } from '../_actions/tournamentUser'
import { fetchOwnedTournaments } from '../_actions/tournament'
import { CurrentTournamentUser, HasAnyUTL, NoSelector, OwnedTournamentWithNoUtl } from '../_selectors'
import UserWithNoTournamentsView from '../tournamentUser/UserWithNoTournamentsView'
import SelectedUTLController from './SelectedUTLController'
import NoUTLsRoutes from './routes/NoUTLsRoutes'
import AppCrucialDataLoader from '../appLoader/AppCrucialDataLoader'

interface Props {
    fetchAndStoreUtls: () => Promise<void>
    fetchOwnedTournaments: () => Promise<void>
    children: ReactNode
}

function TournamentUserController({ fetchAndStoreUtls, fetchOwnedTournaments, children }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [initiated, setInitiated] = useState(false)
    useEffect(() => {
        setIsLoading(true)
        fetchAndStoreUtls().catch((e) => {
            console.log('FAILED to get tournament-user', e)
        })
        .finally(() => {
            setIsLoading(false)
            setInitiated(true)
        })
        fetchOwnedTournaments();
    }, [])

    const currentUtl = useSelector(CurrentTournamentUser)
    const hasAnyUtl = useSelector(HasAnyUTL)
    const ownedTournamnetWithNoUtl = useSelector(OwnedTournamentWithNoUtl)
    const canSelectUtl = hasAnyUtl && !ownedTournamnetWithNoUtl

    return (
        <NoUTLsRoutes>
            {isLoading && (
                <AppCrucialDataLoader name='my-utls-api' />
            )}
            {!isLoading && initiated && (<>
                {!canSelectUtl && (
                    <UserWithNoTournamentsView isMissingUtl={!!ownedTournamnetWithNoUtl}/>
                )}
                {canSelectUtl && (
                    <SelectedUTLController currentUtl={currentUtl}>
                        {children}
                    </SelectedUTLController>
                )}
            </>
            )}
        </NoUTLsRoutes>
    )
}

const mapDispatchToProps = {
    fetchAndStoreUtls,
    fetchOwnedTournaments,
}

export default connect(NoSelector, mapDispatchToProps)(TournamentUserController)
