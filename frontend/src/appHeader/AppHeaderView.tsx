import React from 'react'
import { UtlWithTournament } from '../types'
import AppBar from '@mui/material/AppBar'
import AppMenuMobile from './AppMenuMobile'
import AppMenuDesktop from './AppMenuDesktop'
import { useIsSmScreen } from '../hooks/useMedia'
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
    const isSmallScreen = useIsSmScreen();
    return (
        <div className="LigaBet-AppHeader">
            <AppBar className="appbarHeader">
                {isSmallScreen && (
                    <AppMenuMobile {...{
                        isTournamentStarted,
                        currentUtl,
                        currentRoute,
                        currentUsername,
                        deselectUtl,
                        openDialogChangePassword,
                    }} />
                )}
                {!isSmallScreen && (
                    <AppMenuDesktop {...{
                        isTournamentStarted,
                        currentUtl,
                        currentRoute,
                        currentUsername,
                        deselectUtl,
                        openDialogChangePassword,
                    }} />
                )}
            </AppBar>
        </div>
    )
}

export default AppHeader
