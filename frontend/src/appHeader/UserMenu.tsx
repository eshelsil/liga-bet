import React from 'react'
import { useSelector } from 'react-redux'
import Avatar from '@mui/material/Avatar'
import PersonIcon from '@mui/icons-material/Person';
import LinkMenuItem from './LinkMenuItem'
import { routesMap } from './routes'
import PopupMenu from '../widgets/Menu'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import TeamFlag from '../widgets/TeamFlag/TeamFlag'
import { IsAdmin, MyWinnerTeamSelector } from '../_selectors'



function UserIcon(){
    const winnerTeam = useSelector(MyWinnerTeamSelector)
    return (<>
        {winnerTeam && (
            <div className={`LB-UserIcon ${winnerTeam.is_club ? '' : 'UserIcon-withShadow'}`}>
                <TeamFlag team={winnerTeam} />
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
    openDialogChangePassword: () => void
}

function UserMenu({
    openDialogChangePassword,
}: Props) {
    const themeClass = useTournamentThemeClass();
    const isAdmin = useSelector(IsAdmin)

    return (
        <div className='LigaBet-UserMenu'>
            <PopupMenu
                anchorContent={<UserIcon />}
                classes={{
                    list: themeClass
                }}
            >
                <LinkMenuItem
                    route={routesMap['profile']}
                />
                {isAdmin && (
                    <LinkMenuItem
                        route={routesMap['admin/index']}
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
