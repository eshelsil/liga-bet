import React from 'react'
import LinkMenuItem from './LinkMenuItem'
import { routesMap } from './routes'
import DropMenuItem from './DropMenuItem'
import { TournamentStatus, UtlRole, UtlWithTournament } from '../types'
import { isUtlConfirmed } from '../utils'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTournamentThemeClass } from '../hooks/useTournamentTheme'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import OpenGameBetsItem from './MenuItems/OpenGameBetsItem'
import OpenGroupRankBetsItem from './MenuItems/OpenGroupRankBetsItem'
import OpenQuestionBetsItem from './MenuItems/OpenQuestionBetsItem'
import MyBetsItem from './MenuItems/MyBetsItem'
import { useSelector } from 'react-redux'
import { IsAppMenuEmpty } from '../_selectors'



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

    const hasCurrentUtl = !!currentUtl
    const tournamentStatus = currentUtl?.tournament?.status
    const isConfirmed = hasCurrentUtl && isUtlConfirmed(currentUtl)
    const isTournamentAdmin = hasCurrentUtl && currentUtl.role === UtlRole.Admin
    const isAManager = hasCurrentUtl && currentUtl.role === UtlRole.Manager
    const hasManagerPermissions = isTournamentAdmin || isAManager
    const canUpdateTournamentConfig = isTournamentAdmin && tournamentStatus === TournamentStatus.Initial;
    
    const isEmpty = useSelector(IsAppMenuEmpty)

    return (
        <>
            {hasCurrentUtl && (<>
                {isConfirmed && (<>
                    {isTournamentStarted && (<>
                        <LinkMenuItem
                            route={routesMap['leaderboard']}
                            callback={reRouteCallback}
                        />
                        <OpenGameBetsItem
                            callback={reRouteCallback}
                        />
                        <LinkMenuItem
                            route={routesMap['closed-matches']}
                            callback={reRouteCallback}
                        />
                        <DropMenuItem
                            anchorContent={
                                <div className='flexRow'>
                                    <div>
                                        ניחושים של לפני הטורניר
                                    </div>
                                    <ArrowDropDownIcon />
                                </div>
                            }
                            classes={{list: themeClass}}
                            pathes={['all-questions', 'all-group-standings']}
                        >
                            <LinkMenuItem
                                route={routesMap['all-questions']}
                                callback={reRouteCallback}
                            />
                            <LinkMenuItem
                                route={routesMap['all-group-standings']}
                                callback={reRouteCallback}
                            />
                        </DropMenuItem>
                        <MyBetsItem
                            callback={reRouteCallback}
                        />
                    </>)}
                    {!isTournamentStarted && (<>
                        <LinkMenuItem
                            route={routesMap['leaderboard']}
                            callback={reRouteCallback}
                        />
                        <OpenQuestionBetsItem
                            callback={reRouteCallback}
                        />
                        <OpenGroupRankBetsItem
                            callback={reRouteCallback}
                        />
                        <OpenGameBetsItem
                            callback={reRouteCallback}
                        />
                        <MyBetsItem
                            callback={reRouteCallback}
                        />
                    </>)}
                </>)}
                {hasManagerPermissions && (
                    <DropMenuItem
                        anchorContent={
                            <div className='flexRow'>
                                <div>
                                    ניהול טורניר
                                </div>
                                <ArrowDropDownIcon />
                            </div>
                        }
                        classes={{list: themeClass}}
                        pathes={['tournament-config', 'contestants']}
                    >
                        {canUpdateTournamentConfig && (
                            <LinkMenuItem
                                route={routesMap['tournament-config']}
                                callback={reRouteCallback}
                            />
                        )}
                        <LinkMenuItem
                            route={routesMap['contestants']}
                            callback={reRouteCallback}
                        />
                        {tournamentStatus === TournamentStatus.Initial && (
                            <LinkMenuItem
                                route={routesMap['invite-friends']}
                                callback={reRouteCallback}
                            />
                        )}
                    </DropMenuItem>
                )}
            </>)}
            {(!hasCurrentUtl || isEmpty) && (<>
                <LinkMenuItem
                    route={{
                        path: '',
                        label: 'הרשמה',
                    }}
                    content={<HomeRoundedIcon fill={'#fff'} />}
                    callback={reRouteCallback}
                />
            </>)}
        </>
    )
}

export default TournamentMenuItems
