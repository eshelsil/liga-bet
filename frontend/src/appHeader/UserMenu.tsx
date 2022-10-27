import React from 'react'
import { UtlWithTournament } from '../types'
import LinkMenuItem from './LinkMenuItem'
import { routesMap } from './routes'
import { Avatar } from '@mui/material'
import PopupMenu from '../widgets/Menu'
import { useTournamentThemeClass } from '../hooks/useTournamentTheme'

interface Props {
    currentUtl: UtlWithTournament
    currentUsername: string
    openDialogChangePassword: () => void
}

function UserMenu({
    currentUtl,
    currentUsername,
    openDialogChangePassword,
}: Props) {
    const themeClass = useTournamentThemeClass();

    return (
        <div className='LigaBet-UserMenu'>
            <PopupMenu
                anchorContent={
                    <Avatar className="avatar">
                        {currentUsername[0]}
                    </Avatar>
                }
                classes={{
                    list: themeClass
                }}
            >
                <LinkMenuItem
                    route={routesMap['user']}
                />
                {!!currentUtl && (
                    <LinkMenuItem
                        route={routesMap['utls']}
                    />
                )}
                <LinkMenuItem
                    route={routesMap['set-password']}
                    onClick={openDialogChangePassword}
                />
                <LinkMenuItem
                    route={routesMap['logout']}
                    simpleLink
                />
            </PopupMenu>
        </div>
    )
}

export default UserMenu
