import React from 'react'
import LinkMenuItem from './LinkMenuItem'
import DropMenuItem from './DropMenuItem'
import { UtlWithTournament } from '../types'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import useTournamentNavItems from './useTournamentNavItems'

interface Props {
    currentUtl: UtlWithTournament
    isTournamentStarted: boolean
    reRouteCallback?: () => void
}

function TournamentMenuItems({
    currentUtl,
    isTournamentStarted,
    reRouteCallback,
}: Props) {
    const themeClass = useTournamentThemeClass()
    const {
        showHomeRegistration,
        desktopItems,
        managerItems,
    } = useTournamentNavItems(currentUtl, isTournamentStarted)

    if (showHomeRegistration) {
        return (
            <LinkMenuItem
                route={{
                    path: '',
                    label: 'הרשמה',
                }}
                content={<HomeRoundedIcon fill={'#fff'} />}
                callback={reRouteCallback}
            />
        )
    }

    return (
        <>
            {desktopItems.map((item) => (
                <LinkMenuItem
                    key={item.id}
                    route={item.route}
                    onClick={item.onClick}
                    callback={reRouteCallback}
                    notifications={item.notifications}
                />
            ))}
            {managerItems.length > 0 && (
                <DropMenuItem
                    anchorContent={
                        <div className="flexRow">
                            <div>ניהול טורניר</div>
                            <ArrowDropDownIcon />
                        </div>
                    }
                    classes={{ list: themeClass }}
                    pathes={managerItems.map((item) => item.route.path)}
                >
                    {managerItems.map((item) => (
                        <LinkMenuItem
                            key={item.id}
                            route={item.route}
                            callback={reRouteCallback}
                        />
                    ))}
                </DropMenuItem>
            )}
        </>
    )
}

export default TournamentMenuItems
