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
            className="LigaBet-UserMenu"
            label={
                <Avatar className="avatar">
                    {currentUsername[0]}
                </Avatar>
            }
        >
            <LinkMenuItem
                route={routesMap['user']}
                currentPath={currentRoute}
            />
            {!!currentUtl && (
                <LinkMenuItem
                    route={routesMap['utl']}
                    currentPath={currentRoute}
                />
            )}

            {showManagerManagementViews && (
                <LinkMenuItem
                    route={routesMap['contestants']}
                    currentPath={currentRoute}
                />
            )}
            <LinkMenuItem
                route={routesMap['choose-utl']}
                currentPath={currentRoute}
                onClick={deselectUtl}
            />
            <LinkMenuItem
                route={routesMap['set-password']}
                currentPath={currentRoute}
                onClick={openDialogChangePassword}
            />
            <LinkMenuItem
                route={routesMap['logout']}
                currentPath={currentRoute}
                simpleLink
            />
        </DropMenuItem>
    )
}

export default UserMenu
