import React from 'react'
import LinkMenuItem from './LinkMenuItem'
import { routesMap } from './routes'
import DropMenuItem from './DropMenuItem'
import { TournamentStatus, UtlRole, UtlWithTournament } from '../types'
import { isUtlConfirmed } from '../utils'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TournamentsDropdownMenu from './TournamentsDropdownMenu'
import { useTournamentThemeClass } from '../hooks/useTournamentTheme'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';


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

    return (
        <>
            {hasCurrentUtl && (<>
                <TournamentsDropdownMenu itemClickCallback={reRouteCallback}/>
                {isTournamentAdmin && (
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
                        {[TournamentStatus.Initial, TournamentStatus.OpenForBets].includes(tournamentStatus) && (
                            <LinkMenuItem
                                route={routesMap['tournament-config']}
                                callback={reRouteCallback}
                            />
                        )}
                        <LinkMenuItem
                            route={routesMap['contestants']}
                            callback={reRouteCallback}
                        />
                        {[TournamentStatus.Initial, TournamentStatus.OpenForBets].includes(tournamentStatus) && (
                            <LinkMenuItem
                                route={routesMap['invite-friends']}
                                callback={reRouteCallback}
                            />
                        )}
                    </DropMenuItem>
                )}
                {isConfirmed && (<>
                    {isTournamentStarted && (<>
                        <LinkMenuItem
                            route={routesMap['leaderboard']}
                            callback={reRouteCallback}
                        />
                        <LinkMenuItem
                            route={routesMap['open-matches']}
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
                                        הימורים של לפני הטורניר
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
                        <LinkMenuItem
                            route={routesMap['my-bets']}
                            callback={reRouteCallback}
                        />
                    </>)}
                    {tournamentStatus === TournamentStatus.OpenForBets && (<>
                        <LinkMenuItem
                            route={routesMap['open-matches']}
                            callback={reRouteCallback}
                        />
                        <LinkMenuItem
                            route={routesMap['open-questions']}
                            callback={reRouteCallback}
                        />
                        <LinkMenuItem
                            route={routesMap['open-group-standings']}
                            callback={reRouteCallback}
                        />
                        <LinkMenuItem
                            route={routesMap['my-bets']}
                            callback={reRouteCallback}
                        />
                    </>)}
                </>)}
            </>)}
            {!hasCurrentUtl && (<>
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
