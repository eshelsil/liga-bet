import React from 'react'
import { UtlWithTournament } from '../types'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import UserMenu from './UserMenu'
import TournamentMenuItems from './TournamentMenuItems'

interface Props {
    currentUtl: UtlWithTournament
    isTournamentStarted: boolean
    currentRoute: string
    currentUsername: string
    deselectUtl: () => void
    openDialogChangePassword: () => void
}

function AppMenuDesktop({
    isTournamentStarted,
    currentUtl,
    currentRoute,
    currentUsername,
    deselectUtl,
    openDialogChangePassword,
}: Props) {

    return (
            <Toolbar className="toolbar">
                <Container className="toolbar-container">
                    <TournamentMenuItems {...{
                        isTournamentStarted,
                        currentRoute,
                        currentUtl,
                    }}/>
                </Container>
                <Container className="toolbar-container left-container">
                    <UserMenu
                        {
                            ...{
                                currentUtl,
                                currentRoute,
                                currentUsername,
                                deselectUtl,
                                openDialogChangePassword,
                            }
                        }
                    />
                </Container>
            </Toolbar>
    )
}

export default AppMenuDesktop
