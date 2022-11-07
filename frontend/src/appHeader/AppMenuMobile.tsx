import React, { useState } from 'react'
import { UtlWithTournament } from '../types'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/CloseRounded'
import UserMenu from './UserMenu'
import TournamentMenuItems from './TournamentMenuItems'

interface Props {
    currentUtl: UtlWithTournament
    isTournamentStarted: boolean
    openDialogChangePassword: () => void
}

function AppMenuMobile({
    isTournamentStarted,
    currentUtl,
    openDialogChangePassword,
}: Props) {
    const [menuOpen, setMenuOpen] = useState(false)

    const menuClickedHandler = () => setMenuOpen(!menuOpen)
    const closeMenuHandler = () => setMenuOpen(false)


    return (
        <ClickAwayListener onClickAway={closeMenuHandler}>
            <div className="LigaBet-AppMenuMobile">
                <Toolbar style={{minHeight: 'unset'}}>
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
                            מונדיאל 2022
                        </Typography>
                        <UserMenu openDialogChangePassword={openDialogChangePassword} />
                    </Container>
                </Toolbar>
                {menuOpen && (
                    <Toolbar className="expandSection">
                        <Container className="toolbarContainer-mobile">
                            <TournamentMenuItems {...{
                                isTournamentStarted,
                                currentUtl,
                                reRouteCallback: closeMenuHandler
                            }}/>
                        </Container>
                    </Toolbar>
                )}
            </div>
        </ClickAwayListener>
    )
}

export default AppMenuMobile
