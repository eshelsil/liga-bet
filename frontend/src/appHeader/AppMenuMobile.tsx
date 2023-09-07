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
import TournamentsDropdownMenu from './TournamentsDropdownMenu'
import { Badge } from '@mui/material'
import { useSelector } from 'react-redux'
import { CurrentTournament, MissingBetsCount } from '../_selectors'


function MenuWithNotification(){
    const missingBets = useSelector(MissingBetsCount)
    const hasMissingBets = missingBets > 0
    return (<>
        {hasMissingBets && (
            <Badge color='error' overlap='circular' variant='dot' badgeContent=' '>
                <MenuIcon />
            </Badge>
        )}
        {!hasMissingBets && (
            <MenuIcon />
        )}
    </>)
}

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

    const tournament = useSelector(CurrentTournament)

    return (
        <ClickAwayListener onClickAway={closeMenuHandler}>
            <div className="LigaBet-AppMenuMobile">
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
                            {menuOpen
                            ? <CloseIcon />
                            : <MenuWithNotification />
                            }
                        </IconButton>
                        <Typography variant="h5" className="appName">
                            ליגה ב' - {tournament?.competition?.name ?? ''}
                        </Typography>
                        <div className='AppMenuMobile-leftSide'>
                            <TournamentsDropdownMenu />
                            <UserMenu openDialogChangePassword={openDialogChangePassword} />
                        </div>
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
