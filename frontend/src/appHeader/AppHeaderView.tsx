import React from 'react'
import { UtlWithTournament } from '../types'
import AppBar from '@mui/material/AppBar'
import AppMenuDesktop from './AppMenuDesktop'
import AppMenuMobileCompact from './AppMenuMobileCompact'
import { useIsSmScreen } from '../hooks/useMedia'
import './style.scss'

interface Props {
    currentUtl: UtlWithTournament
    isTournamentStarted: boolean
    openDialogChangePassword: () => void
    tournamentIndex: number
    isAppMenuEmpty: boolean
}

function AppHeader({
    isTournamentStarted,
    currentUtl,
    openDialogChangePassword,
    tournamentIndex,
    isAppMenuEmpty,
}: Props) {
    const isSmallScreen = useIsSmScreen()
    const showCompactMobile = isSmallScreen && !isAppMenuEmpty

    return (
        <div className={`LigaBet-AppHeader w-full tournament-theme tournament-theme-${tournamentIndex + 1}`}>
            <AppBar className="appbarHeader">
                {showCompactMobile && (
                    <AppMenuMobileCompact
                        openDialogChangePassword={openDialogChangePassword}
                    />
                )}
                {!showCompactMobile && (
                    <AppMenuDesktop
                        {...{
                            isTournamentStarted,
                            currentUtl,
                            openDialogChangePassword,
                        }}
                    />
                )}
            </AppBar>
        </div>
    )
}

export default AppHeader
