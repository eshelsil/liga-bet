import React from 'react'
import { useSelector } from 'react-redux'
import Avatar from '@mui/material/Avatar'
import PersonIcon from '@mui/icons-material/Person';
import LinkMenuItem from './LinkMenuItem'
import { routesMap } from './routes'
import PopupMenu from '../widgets/Menu'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import TeamFlag from '../widgets/TeamFlag/TeamFlag'
import { EverGrantedNihus, IsAdmin, IsCfUser, MyWinnerTeamSelector } from '../_selectors'
import NihusimItemContent from './NihusimItemContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useIsXsScreen } from '@/hooks/useMedia';
import { cn } from '@/utils/tailwind';



function UserIcon(){
    const winnerTeam = useSelector(MyWinnerTeamSelector)
    const isXsScreen = useIsXsScreen()
    const isCfUser = useSelector(IsCfUser)
    return (<>
        {isCfUser ? (
            <div className={`LB-UserIcon UserIcon-withShadow`}>
                <div className={cn('relative rounded-full bg-white size-[50px] pt-2.5 pl-2.5 pr-1.5 pb-1.5', {
                    'size-[40px]':isXsScreen,
                })}>
                    <img className={cn("size-5 absolute top-1.5 left-1.5",{'size-4 left-1 top-1':isXsScreen})} src={'/favicon.ico'} />
                    <img className="w-full h-full" src={'https://talent.carefam.com/favicon.ico'} />
                </div>
            </div>
        ):(
            <>
                {winnerTeam && (
                    <div className={`LB-UserIcon ${winnerTeam.is_club ? '' : 'UserIcon-withShadow'}`}>
                        <TeamFlag team={winnerTeam} size={isXsScreen ? 40 : 50} />
                        <PersonIcon className={cn('personIcon', {'!text-[30px]':isXsScreen })} />
                    </div>
                )}
                {!winnerTeam && (
                    <Avatar className={cn('avatar', {'!w-10 !h-10': isXsScreen})}>
                        <PersonIcon style={{color: '#fff'}} />
                    </Avatar>
                )}
            </>
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

    return (
        <div className='LigaBet-UserMenu xs:!px-1'>
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
                {ShowNihusim && (
                    <LinkMenuItem
                        route={routesMap['nihusim']}
                        content={<NihusimItemContent />}
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
