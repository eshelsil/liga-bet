import React from 'react'
import { UtlWithTournament } from '../types'
import AppBar from '@mui/material/AppBar'
import AppMenuMobile from './AppMenuMobile'
import AppMenuDesktop from './AppMenuDesktop'
import { useIsSmScreen } from '../hooks/useMedia'
import WhatifMenu from './WhatifsMenu'
import './style.scss'

interface Props {
    currentUtl: UtlWithTournament
    isTournamentStarted: boolean
    openDialogChangePassword: () => void
    tournamentIndex: number
    isAppMenuEmpty: boolean
    isWhatifOn: boolean
}

function AppHeader({
    isTournamentStarted,
    currentUtl,
    openDialogChangePassword,
    tournamentIndex,
    isAppMenuEmpty,
    isWhatifOn,
}: Props) {
    const isSmallScreen = useIsSmScreen();
    const showExpandableMenu = isSmallScreen && !isAppMenuEmpty

    return (
        <div className={`LigaBet-AppHeader w-full tournament-theme tournament-theme-${tournamentIndex + 1}`}>
            {isWhatifOn && (
                <WhatifMenu />
            )}
            {!isWhatifOn && (
                <AppBar className="appbarHeader">
                    {showExpandableMenu && (
                        <AppMenuMobile {...{
                            isTournamentStarted,
                            currentUtl,
                            openDialogChangePassword,
                        }} />
                    )}
                    {!showExpandableMenu && (
                        <AppMenuDesktop {...{
                            isTournamentStarted,
                            currentUtl,
                            openDialogChangePassword,
                        }} />
                    )}
                </AppBar>
            )}
        </div>
    )
}

export default AppHeader
