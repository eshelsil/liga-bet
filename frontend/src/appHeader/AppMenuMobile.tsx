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
import LanguageMenu from './LanguageMenu'
import TournamentMenuItems from './TournamentMenuItems'
import TournamentsDropdownMenu from './TournamentsDropdownMenu'
import { Badge } from '@mui/material'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { CurrentTournament, IsCfUser, MissingBetsCount } from '../_selectors'


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
    const { t } = useTranslation('appHeader')
    const [menuOpen, setMenuOpen] = useState(false)

    const menuClickedHandler = () => setMenuOpen(!menuOpen)
    const closeMenuHandler = () => setMenuOpen(false)

    const tournament = useSelector(CurrentTournament)
    const isCfUser = useSelector(IsCfUser)

    return (
        <ClickAwayListener onClickAway={closeMenuHandler}>
            <div className="LigaBet-AppMenuMobile">
                <Toolbar classes={{ root: 'sm:!px-1' }}>
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
                            {t('appName', { competition: tournament?.competition?.name ?? '' })}
                        </Typography>
                        <div className='AppMenuMobile-leftSide'>
                            {!isCfUser && (
                            <TournamentsDropdownMenu />
                            )}
                            <LanguageMenu />
                            <div className="bg-black/15 h-8 w-px mx-2 sm:mx-1" />
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
