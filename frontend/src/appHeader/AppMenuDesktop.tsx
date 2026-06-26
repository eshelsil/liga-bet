import React from 'react'
import { UtlWithTournament } from '../types'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import UserMenu from './UserMenu'
import LanguageMenu from './LanguageMenu'
import TournamentMenuItems from './TournamentMenuItems'
import TournamentsDropdownMenu from './TournamentsDropdownMenu'
import { IsCfUser } from '@/_selectors/base/models'
import { useSelector } from 'react-redux/es/hooks/useSelector'

interface Props {
    currentUtl: UtlWithTournament
    isTournamentStarted: boolean
    openDialogChangePassword: () => void
}

function AppMenuDesktop({
    isTournamentStarted,
    currentUtl,
    openDialogChangePassword,
}: Props) {
    const isCfUser = useSelector(IsCfUser)
    return (
            <Toolbar className="LigaBet-AppMenuDesktop">
                <Container className="toolbarContainer">
                    <TournamentMenuItems {...{
                        isTournamentStarted,
                        currentUtl,
                    }}/>
                </Container>
                <Container className="toolbarContainer stickToLeft">
                    {!isCfUser && (
                        <TournamentsDropdownMenu />
                    )}
                    <LanguageMenu />
                    <div className="bg-black/15 h-8 w-px mx-2 sm:mx-1" />
                    <UserMenu openDialogChangePassword={openDialogChangePassword} />
                </Container>
            </Toolbar>
    )
}

export default AppMenuDesktop
