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
                        route={routesMap['leaderboard']}
                        currentPath={currentRoute}
                        callback={callback}
                    />
                    <LinkMenuItem
                        route={routesMap['open-matches']}
                        currentPath={currentRoute}
                        callback={callback}
                    />
                    <LinkMenuItem
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
                    >
                        <LinkMenuItem
                            route={routesMap[groupBetsRoute]}
                            currentPath={currentRoute}
                            callback={callback}
                        />
                        <LinkMenuItem
                            route={routesMap[specialBetsRoute]}
                            currentPath={currentRoute}
                            callback={callback}
                        />
                    </DropMenuItem>
                    <LinkMenuItem
                        route={routesMap['my-bets']}
                        currentPath={currentRoute}
                        callback={callback}
                    />
                </>)}
            </>)}
        </>
    )
}

export default TournamentMenuItems
