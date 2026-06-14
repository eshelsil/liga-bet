import React from 'react'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import UserMenu from './UserMenu'
import TournamentsDropdownMenu from './TournamentsDropdownMenu'
import { useSelector } from 'react-redux'
import { CurrentTournament } from '../_selectors'

interface Props {
    openDialogChangePassword: () => void
}

function AppMenuMobileCompact({ openDialogChangePassword }: Props) {
    const tournament = useSelector(CurrentTournament)

    return (
        <div className="LigaBet-AppMenuMobileCompact">
            <Toolbar>
                <Container className="mobileMenuHeader">
                    <Typography variant="h5" className="appName">
                        ליגה ב' - {tournament?.competition?.name ?? ''}
                    </Typography>
                    <div className="AppMenuMobile-leftSide">
                        <TournamentsDropdownMenu />
                        <UserMenu
                            openDialogChangePassword={openDialogChangePassword}
                        />
                    </div>
                </Container>
            </Toolbar>
        </div>
    )
}

export default AppMenuMobileCompact
