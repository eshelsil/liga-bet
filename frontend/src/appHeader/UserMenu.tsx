import React from 'react'
import { UtlWithTournament } from '../types'
import { hasManagePermissions } from '../utils'
import LinkMenuItem from './LinkMenuItem'
import { routesMap } from './routes'
import { Avatar } from '@mui/material'
import DropMenuItem from './DropMenuItem'

interface Props {
    currentUtl: UtlWithTournament
    currentRoute: string
    currentUsername: string
    deselectUtl: () => void
    openDialogChangePassword: () => void
}

function UserMenu({
    currentUtl,
    currentRoute,
    currentUsername,
    deselectUtl,
    openDialogChangePassword,
}: Props) {
    const showManagerManagementViews = hasManagePermissions(currentUtl)

    return (
        <DropMenuItem
            className="LigaBet-UserMenu avatar-drop-menu"
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
            {!!currentUtl && (
                <LinkMenuItem
                    route={routesMap['utl']}
                    className="menu-item"
                    currentPath={currentRoute}
                />
            )}

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
                simpleLink
            />
        </DropMenuItem>
    )
}

export default UserMenu
