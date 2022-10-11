import React from 'react'
import { UtlWithTournament } from '../types'
import AppBar from '@mui/material/AppBar'
import AppMenuMobile from './AppMenuMobile'
import AppMenuDesktop from './AppMenuDesktop'
import './style.scss'

interface Props {
    currentUtl: UtlWithTournament
    currentUsername: string
    isTournamentStarted: boolean
    currentRoute: string
    deselectUtl: () => void
    openDialogChangePassword: () => void
}

function AppHeader({
    isTournamentStarted,
    currentUtl,
    currentUsername,
    currentRoute,
    deselectUtl,
    openDialogChangePassword,
}: Props) {

    // TODO: fix to conditional rendering instead of hide/display using scss
    return (
        <div className="LigaBet-AppHeader">
            <AppBar className="appbar-header">
                <AppMenuMobile {...{
                    isTournamentStarted,
                    currentUtl,
                    currentRoute,
                    currentUsername,
                    deselectUtl,
                    openDialogChangePassword,
                }} />
                <AppMenuDesktop {...{
                    isTournamentStarted,
                    currentUtl,
                    currentRoute,
                    currentUsername,
                    deselectUtl,
                    openDialogChangePassword,
                }} />
            </AppBar>
        </div>
    )
}

export default AppHeader
