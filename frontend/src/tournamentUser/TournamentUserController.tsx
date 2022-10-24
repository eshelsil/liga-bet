import React, { ReactNode, useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { fetchAndStoreUtls } from '../_actions/tournamentUser'
import { CurrentTournamentUser, HasAnyUTL, NoSelector } from '../_selectors'
import UserWithNoTournamentsView from './UserWithNoTournamentsView'
import LoadingTournamentsView from './LoadingTournamentsView'
import UserPage from '../myUser'
import SelectedUTLController from './SelectedUTLController'
import CreateNewTournament from './CreateNewTournament'
import JoinTournament from './JoinTournament'
import ManageUsers from '../manageUsers';
import './style.scss';

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
        <Switch>
            <Route path="/user" component={UserPage} />
            <Route path='/admin/users' component={ManageUsers} />
            <Route path="/join-tournament" component={JoinTournament} />
            <Route path="/create-tournament" component={CreateNewTournament} />
            <Route>
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
            </Route>
        </Switch>
    )
}

const mapDispatchToProps = {
    fetchAndStoreUtls,
}

export default connect(NoSelector, mapDispatchToProps)(TournamentUserController)
