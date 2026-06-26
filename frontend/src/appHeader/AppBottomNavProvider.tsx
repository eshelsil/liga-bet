import React from 'react'
import { useSelector } from 'react-redux'
import { AppHeaderSelector } from '../_selectors'
import { useIsSmScreen } from '../hooks/useMedia'
import AppBottomNav from './AppBottomNav'

function AppBottomNavProvider() {
    const isSmallScreen = useIsSmScreen()
    const { isTournamentStarted, currentUtl, isAppMenuEmpty } =
        useSelector(AppHeaderSelector)

    if (!isSmallScreen || isAppMenuEmpty) {
        return null
    }

    return (
        <AppBottomNav
            currentUtl={currentUtl}
            isTournamentStarted={isTournamentStarted}
        />
    )
}

export default AppBottomNavProvider
