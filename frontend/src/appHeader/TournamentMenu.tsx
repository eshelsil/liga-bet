import React, { useState } from 'react'
import { UtlWithTournament } from '../types'
import { hasManagePermissions, isUtlConfirmed } from '../utils'
import ManageUTLsIcon from '@mui/icons-material/PeopleAltOutlined'
import TournamentIcon from '@mui/icons-material/EmojiEventsOutlined'
import LinkMenuItem from './LinkMenuItem'
import { routesMap } from './routes'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import { Avatar, IconButton, Typography } from '@mui/material'
import DropMenuItem from './DropMenuItem'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/CloseRounded'

interface Props {
    currentUtl: UtlWithTournament
    isTournamentStarted: boolean
    currentRoute: string
    currentUsername: string
    deselectUtl: () => void
    openDialogChangePassword: () => void
}

function TournamentMenu({
    isTournamentStarted,
    currentUtl,
    currentRoute,
    currentUsername,
    deselectUtl,
    openDialogChangePassword,
}: Props) {
    const showManagerManagementViews = hasManagePermissions(currentUtl)
    const [menuOpen, setMenuOpen] = useState(false)

    const menuClickedHandler = () => setMenuOpen(!menuOpen)
    const closeMenuHandler = () => setMenuOpen(false)

    const groupBetsRoute = isTournamentStarted
        ? 'all-group-standings'
        : 'open-group-standings'
    const specialBetsRoute = isTournamentStarted
        ? 'all-questions'
        : 'open-questions'

    return (
        <AppBar className="appbar-header" position="static">
            <Toolbar className="toolbar-mobile">
                <Container className="mobile-container">
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
                    <Typography variant="h5" className="app-name">
                        ליגה ב'
                    </Typography>
                    <DropMenuItem
                        className="avatar-drop-menu"
                        label={
                            <Avatar className="avatar">
                                {currentUsername[0]}
                            </Avatar>
                        }
                    >
                        <LinkMenuItem
                            route={routesMap['user']}
                            className="menu-item"
                            currentPath={currentRoute}
                        />
                        <LinkMenuItem
                            route={routesMap['utl']}
                            className="menu-item"
                            currentPath={currentRoute}
                        />

                        {showManagerManagementViews && (
                            <LinkMenuItem
                                route={routesMap['contestants']}
                                className="menu-item"
                                currentPath={currentRoute}
                            />
                        )}
                        <LinkMenuItem
                            route={routesMap['choose-utl']}
                            className="menu-item"
                            currentPath={currentRoute}
                            onClick={deselectUtl}
                        />
                        <LinkMenuItem
                            route={routesMap['set-password']}
                            className="menu-item"
                            currentPath={currentRoute}
                            onClick={openDialogChangePassword}
                        />
                        <LinkMenuItem
                            route={routesMap['logout']}
                            className="menu-item"
                            currentPath={currentRoute}
                        />
                    </DropMenuItem>
                </Container>
            </Toolbar>
            <Toolbar
                className="toolbar-mobile"
                style={{ maxHeight: menuOpen ? '100vh' : 0 }}
            >
                <Container className="toolbar-container-mobile">
                    <LinkMenuItem
                        className="appbar-item"
                        route={routesMap['leaderboard']}
                        currentPath={currentRoute}
                        closeMenuHandler={closeMenuHandler}
                    />
                    <LinkMenuItem
                        className="appbar-item"
                        route={routesMap['open-matches']}
                        currentPath={currentRoute}
                        closeMenuHandler={closeMenuHandler}
                    />
                    <LinkMenuItem
                        className="appbar-item"
                        route={routesMap['closed-matches']}
                        currentPath={currentRoute}
                        closeMenuHandler={closeMenuHandler}
                    />
                    <DropMenuItem
                        label={
                            <div className={'menu-item'}>
                                הימורים של לפני הטורניר
                            </div>
                        }
                        className="appbar-item"
                    >
                        <LinkMenuItem
                            route={routesMap[groupBetsRoute]}
                            className="menu-item"
                            currentPath={currentRoute}
                            closeMenuHandler={closeMenuHandler}
                        />
                        <LinkMenuItem
                            route={routesMap[specialBetsRoute]}
                            className="menu-item"
                            currentPath={currentRoute}
                            closeMenuHandler={closeMenuHandler}
                        />
                    </DropMenuItem>
                    <LinkMenuItem
                        route={routesMap['my-bets']}
                        className="appbar-item"
                        currentPath={currentRoute}
                        closeMenuHandler={closeMenuHandler}
                    />
                </Container>
            </Toolbar>
            <Toolbar className="toolbar">
                <Container className="toolbar-container">
                    <LinkMenuItem
                        className="appbar-item"
                        route={routesMap['leaderboard']}
                        currentPath={currentRoute}
                    />
                    <LinkMenuItem
                        className="appbar-item"
                        route={routesMap['open-matches']}
                        currentPath={currentRoute}
                    />
                    <LinkMenuItem
                        className="appbar-item"
                        route={routesMap['closed-matches']}
                        currentPath={currentRoute}
                    />
                    <DropMenuItem
                        label={
                            <div className={'menu-item'}>
                                הימורים של לפני הטורניר
                            </div>
                        }
                        className="appbar-item"
                    >
                        <LinkMenuItem
                            route={routesMap[groupBetsRoute]}
                            className="menu-item"
                            currentPath={currentRoute}
                        />
                        <LinkMenuItem
                            route={routesMap[specialBetsRoute]}
                            className="menu-item"
                            currentPath={currentRoute}
                        />
                    </DropMenuItem>
                    <LinkMenuItem
                        route={routesMap['my-bets']}
                        className="appbar-item"
                        currentPath={currentRoute}
                    />
                </Container>
                <Container className="toolbar-container left-container">
                    <DropMenuItem
                        className="avatar-drop-menu"
                        label={
                            <Avatar className="avatar">
                                {currentUsername[0]}
                            </Avatar>
                        }
                    >
                        <LinkMenuItem
                            route={routesMap['user']}
                            className="menu-item"
                            currentPath={currentRoute}
                        />
                        <LinkMenuItem
                            route={routesMap['utl']}
                            className="menu-item"
                            currentPath={currentRoute}
                        />

                        {showManagerManagementViews && (
                            <LinkMenuItem
                                route={routesMap['contestants']}
                                className="menu-item"
                                currentPath={currentRoute}
                            />
                        )}
                        <LinkMenuItem
                            route={routesMap['choose-utl']}
                            className="menu-item"
                            currentPath={currentRoute}
                            onClick={deselectUtl}
                        />
                        <LinkMenuItem
                            route={routesMap['set-password']}
                            className="menu-item"
                            currentPath={currentRoute}
                            onClick={openDialogChangePassword}
                        />
                        <LinkMenuItem
                            route={routesMap['logout']}
                            className="menu-item"
                            currentPath={currentRoute}
                        />
                    </DropMenuItem>
                </Container>
            </Toolbar>
        </AppBar>
    )
}

export default TournamentMenu
