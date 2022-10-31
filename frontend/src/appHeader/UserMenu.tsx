import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import { UtlWithTournament } from '../types'
import LinkMenuItem from './LinkMenuItem'
import { routesMap } from './routes'
import PopupMenu from '../widgets/Menu'
import { useTournamentThemeClass } from '../hooks/useTournamentTheme'
import TeamFlag from '../widgets/TeamFlag/TeamFlag'
import { MyWinnerTeamSelector } from '../_selectors'



function UserIcon(){
    const winnerTeam = useSelector(MyWinnerTeamSelector)
    return (<>
        {winnerTeam && (
            <div className='LB-UserIcon'>
                <TeamFlag name={winnerTeam.name} />
                <PersonIcon className='personIcon' />
            </div>
        )}
        {!winnerTeam && (
            <Avatar className="avatar">
                <PersonIcon style={{color: '#fff'}} />
            </Avatar>
        )}
    </>)
}

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
                anchorContent={<UserIcon />}
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
