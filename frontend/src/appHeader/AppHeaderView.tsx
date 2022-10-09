import React from 'react'
import { UtlWithTournament } from '../types'
import UserMenuView from './UserMenuView'
import TournamentMenu from './TournamentMenu'
import './style.scss'

interface Props {
    currentUtl: UtlWithTournament
    currentUsername: string
    isTournamentStarted: boolean
    currentRoute: string
    goToUserPage: () => void
    goToUtlPage: () => void
    deselectUtl: () => void
    openDialogChangePassword: () => void
}

function AppHeader({
    isTournamentStarted,
    currentUtl,
    currentUsername,
    currentRoute,
    goToUserPage,
    goToUtlPage,
    deselectUtl,
    openDialogChangePassword,
}: Props) {
    return (
        <div className="LigaBet-AppHeader">
            {/*<UserMenuView {...{*/}
            {/*	deselectUtl,*/}
            {/*	currentRoute,*/}
            {/*	currentUsername,*/}
            {/*	goToUserPage,*/}
            {/*	openDialogChangePassword,*/}
            {/*}} />*/}
            {!!currentUtl && (
                <TournamentMenu
                    {...{
                        currentUtl,
                        currentRoute,
                        isTournamentStarted,
                        currentUsername,
                        deselectUtl,
                        openDialogChangePassword,
                    }}
                />
            )}
        </div>
    )
}

export default AppHeader
