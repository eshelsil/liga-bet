import React, { ReactNode, useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { fetchAndStoreUtls } from '../_actions/tournamentUser'
import { CurrentTournamentUser, HasAnyUTL, NoSelector } from '../_selectors'
import UserWithNoTournamentsView from '../tournamentUser/UserWithNoTournamentsView'
import LoadingTournamentsView from './LoadingTournamentsView'
import SelectedUTLController from './SelectedUTLController'
import NoUTLsRoutes from './routes/NoUTLsRoutes'

interface Props {
    fetchAndStoreUtls: () => Promise<void>
    children: ReactNode
}

function TournamentUserController({ fetchAndStoreUtls, children }: Props) {
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
    }, [])

    const currentUtl = useSelector(CurrentTournamentUser)
    const hasAnyUtl = useSelector(HasAnyUTL)

    return (
        <NoUTLsRoutes>
            {isLoading && (
                <LoadingTournamentsView />
            )}
            {!isLoading && initiated && (<>
                {!hasAnyUtl && (
                    <UserWithNoTournamentsView />
                )}
                {hasAnyUtl && (
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
}

export default connect(NoSelector, mapDispatchToProps)(TournamentUserController)
