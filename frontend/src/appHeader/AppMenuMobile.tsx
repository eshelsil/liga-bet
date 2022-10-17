import React, { useState } from 'react'
import { UtlWithTournament } from '../types'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import { IconButton, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/CloseRounded'
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

function AppMenuMobile({
    isTournamentStarted,
    currentUtl,
    currentRoute,
    currentUsername,
    deselectUtl,
    openDialogChangePassword,
}: Props) {
    const [menuOpen, setMenuOpen] = useState(false)

    const menuClickedHandler = () => setMenuOpen(!menuOpen)
    const closeMenuHandler = () => setMenuOpen(false)


    return (
        <div  className="LigaBet-AppMenuMobile">
            <Toolbar>
                <Container className="mobileMenuHeader">
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                        onClick={menuClickedHandler}
                    >
                        {menuOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                    <Typography variant="h5" className="appName">
                        ליגה ב'
                    </Typography>
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
            {menuOpen && (
                <Toolbar className="expandSection">
                    <Container className="toolbarContainer-mobile">
                        <TournamentMenuItems {...{
                            isTournamentStarted,
                            currentRoute,
                            currentUtl,
                            callback: closeMenuHandler,
                        }}/>
                    </Container>
                </Toolbar>
            )}
        </div>
    )
}

export default AppMenuMobile
