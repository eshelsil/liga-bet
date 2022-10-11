import React from 'react'
import LinkMenuItem from './LinkMenuItem'
import { routesMap } from './routes'
import DropMenuItem from './DropMenuItem'
import { UtlWithTournament } from '../types'
import { isUtlConfirmed } from '../utils'

interface Props {
    currentUtl: UtlWithTournament
    isTournamentStarted: boolean
    currentRoute: string
    callback?: () => void
}

function TournamentMenuItems({
    currentUtl,
    isTournamentStarted,
    currentRoute,
    callback,
}: Props) {


    const groupBetsRoute = isTournamentStarted
        ? 'all-group-standings'
        : 'open-group-standings'
    const specialBetsRoute = isTournamentStarted
        ? 'all-questions'
        : 'open-questions'

    const hasCurrentUtl = !!currentUtl
    const isConfirmed = hasCurrentUtl && isUtlConfirmed(currentUtl)

    return (
        <>
            {hasCurrentUtl && (<>
                {isConfirmed && (<>
                    <LinkMenuItem
                        className="appbar-item"
                        route={routesMap['leaderboard']}
                        currentPath={currentRoute}
                        callback={callback}
                    />
                    <LinkMenuItem
                        className="appbar-item"
                        route={routesMap['open-matches']}
                        currentPath={currentRoute}
                        callback={callback}
                    />
                    <LinkMenuItem
                        className="appbar-item"
                        route={routesMap['closed-matches']}
                        currentPath={currentRoute}
                        callback={callback}
                    />
                    <DropMenuItem
                        label={
                            <div className={'menu-item'}>
                                הימורים של לפני הטורניר
                            </div>
                        }
                        className="appbar-item"
                    >
                        <LinkMenuItem
                            route={routesMap[groupBetsRoute]}
                            className="menu-item"
                            currentPath={currentRoute}
                            callback={callback}
                        />
                        <LinkMenuItem
                            route={routesMap[specialBetsRoute]}
                            className="menu-item"
                            currentPath={currentRoute}
                            callback={callback}
                        />
                    </DropMenuItem>
                    <LinkMenuItem
                        route={routesMap['my-bets']}
                        className="appbar-item"
                        currentPath={currentRoute}
                        callback={callback}
                    />
                </>)}
            </>)}
        </>
    )
}

export default TournamentMenuItems
