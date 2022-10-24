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
    openDialogChangePassword: () => void
    tournamentIndex: number
}

function AppHeader({
    isTournamentStarted,
    currentUtl,
    currentUsername,
    openDialogChangePassword,
    tournamentIndex,
}: Props) {
    const isSmallScreen = useIsSmScreen();
    const showExpandableMenu = isSmallScreen && !!currentUtl

    return (
        <div className={`LigaBet-AppHeader tournament-theme tournament-theme-${tournamentIndex + 1}`}>
            <AppBar className="appbarHeader">
                {showExpandableMenu && (
                    <AppMenuMobile {...{
                        isTournamentStarted,
                        currentUtl,
                        currentUsername,
                        openDialogChangePassword,
                    }} />
                )}
                {!showExpandableMenu && (
                    <AppMenuDesktop {...{
                        isTournamentStarted,
                        currentUtl,
                        currentUsername,
                        openDialogChangePassword,
                    }} />
                )}
            </AppBar>
        </div>
    )
}

export default AppHeader
