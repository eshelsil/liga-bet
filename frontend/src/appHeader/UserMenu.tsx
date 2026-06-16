import React from 'react'
import { useSelector } from 'react-redux'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import PersonIcon from '@mui/icons-material/Person';
import LinkMenuItem from './LinkMenuItem'
import { routesMap } from './routes'
import PopupMenu from '../widgets/Menu'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import TeamFlag from '../widgets/TeamFlag/TeamFlag'
import { AppHeaderSelector, EverGrantedNihus, IsAdmin, IsConfirmedUtl, MyWinnerTeamSelector } from '../_selectors'
import NihusimItemContent from './NihusimItemContent';
import useTournamentNavItems from './useTournamentNavItems';



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
    const ShowNihusim = useSelector(EverGrantedNihus)
    const isConfirmed = useSelector(IsConfirmedUtl)
    const { currentUtl, isTournamentStarted } = useSelector(AppHeaderSelector)
    const { managerItems } = useTournamentNavItems(
        currentUtl,
        isTournamentStarted
    )

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
                {isConfirmed && (
                    <LinkMenuItem
                        route={routesMap['my-bets']}
                    />
                )}
                {isAdmin && (
                    <LinkMenuItem
                        route={routesMap['admin/index']}
                    />
                )}
                {ShowNihusim && (
                    <LinkMenuItem
                        route={routesMap['nihusim']}
                        content={<NihusimItemContent />}
                    />
                )}
                {managerItems.length > 0 && (
                    <>
                        <Divider />
                        {managerItems.map((item) => (
                            <LinkMenuItem
                                key={item.id}
                                route={item.route}
                                onClick={item.onClick}
                            />
                        ))}
                    </>
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
