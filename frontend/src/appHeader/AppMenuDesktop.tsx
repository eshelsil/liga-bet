import React from 'react'
import { UtlWithTournament } from '../types'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import UserMenu from './UserMenu'
import TournamentMenuItems from './TournamentMenuItems'

interface Props {
    currentUtl: UtlWithTournament
    isTournamentStarted: boolean
    currentUsername: string
    openDialogChangePassword: () => void
}

function AppMenuDesktop({
    isTournamentStarted,
    currentUtl,
    currentUsername,
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
                    <UserMenu
                        {
                            ...{
                                currentUtl,
                                currentUsername,
                                openDialogChangePassword,
                            }
                        }
                    />
                </Container>
            </Toolbar>
    )
}

export default AppMenuDesktop
