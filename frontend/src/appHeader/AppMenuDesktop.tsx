import React from 'react'
import { UtlWithTournament } from '../types'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import UserMenu from './UserMenu'
import TournamentMenuItems from './TournamentMenuItems'
import TournamentsDropdownMenu from './TournamentsDropdownMenu'

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

    return (
            <Toolbar className="LigaBet-AppMenuDesktop">
                <Container className="toolbarContainer">
                    <TournamentMenuItems {...{
                        isTournamentStarted,
                        currentUtl,
                    }}/>
                </Container>
                <Container className="toolbarContainer stickToLeft">
                    <TournamentsDropdownMenu />
                    <UserMenu openDialogChangePassword={openDialogChangePassword} />
                </Container>
            </Toolbar>
    )
}

export default AppMenuDesktop
