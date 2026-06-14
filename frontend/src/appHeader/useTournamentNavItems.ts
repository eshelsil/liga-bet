import { useSelector } from 'react-redux'
import {
    IsAppMenuEmpty,
    ManageTournamentIsAccessible,
    MissingGameBetsCount,
    MissingGroupRankBetsCount,
    MissingQuestionBetsCount,
} from '../_selectors'
import { TournamentStatus, UtlRole, UtlWithTournament } from '../types'
import { isUtlConfirmed } from '../utils'
import useGoTo from '../hooks/useGoTo'
import { routesMap } from './routes'
import { Route } from './types'

export interface TournamentNavItem {
    id: string
    route: Route
    notifications?: number
    onClick?: () => void
}

export interface TournamentNavLayout {
    showHomeRegistration: boolean
    desktopItems: TournamentNavItem[]
    managerItems: TournamentNavItem[]
    bottomNavLeft: TournamentNavItem[]
    bottomNavFab: TournamentNavItem
    bottomNavRight: TournamentNavItem[]
    overflowItems: TournamentNavItem[]
}

function useTournamentNavItems(
    currentUtl: UtlWithTournament,
    isTournamentStarted: boolean
): TournamentNavLayout {
    const { goToClosedGameBets } = useGoTo()

    const isEmpty = useSelector(IsAppMenuEmpty)
    const showTournamentManage = useSelector(ManageTournamentIsAccessible)
    const missingGameBets = useSelector(MissingGameBetsCount)
    const missingQuestionBets = useSelector(MissingQuestionBetsCount)
    const missingGroupRankBets = useSelector(MissingGroupRankBetsCount)

    const hasCurrentUtl = !!currentUtl
    const tournamentStatus = currentUtl?.tournament?.status
    const isConfirmed = hasCurrentUtl && isUtlConfirmed(currentUtl)
    const isTournamentAdmin = hasCurrentUtl && currentUtl.role === UtlRole.Admin
    const isAManager = hasCurrentUtl && currentUtl.role === UtlRole.Manager
    const hasManagerPermissions = isTournamentAdmin || isAManager
    const canUpdateTournamentConfig = isTournamentAdmin

    const showHomeRegistration = !hasCurrentUtl || isEmpty

    if (!hasCurrentUtl || !isConfirmed) {
        return {
            showHomeRegistration,
            desktopItems: [],
            managerItems: [],
            bottomNavLeft: [],
            bottomNavFab: {
                id: 'open-matches',
                route: routesMap['open-matches'],
            },
            bottomNavRight: [],
            overflowItems: [],
        }
    }

    const leaderboard: TournamentNavItem = {
        id: 'leaderboard',
        route: routesMap['leaderboard'],
    }

    const openMatches: TournamentNavItem = {
        id: 'open-matches',
        route: routesMap['open-matches'],
        notifications: missingGameBets,
    }

    const closedBets: TournamentNavItem = {
        id: 'closed-bets',
        route: routesMap['closed-bets'],
        onClick: goToClosedGameBets,
    }

    const openQuestions: TournamentNavItem = {
        id: 'open-questions',
        route: routesMap['open-questions'],
        notifications: missingQuestionBets,
    }

    const openGroupStandings: TournamentNavItem = {
        id: 'open-group-standings',
        route: routesMap['open-group-standings'],
        notifications: missingGroupRankBets,
    }

    const managerItems: TournamentNavItem[] = []
    if (hasManagerPermissions && showTournamentManage) {
        if (canUpdateTournamentConfig) {
            managerItems.push({
                id: 'tournament-config',
                route: routesMap['tournament-config'],
            })
        }
        managerItems.push({
            id: 'contestants',
            route: routesMap['contestants'],
        })
        if (tournamentStatus === TournamentStatus.Initial) {
            managerItems.push({
                id: 'invite-friends',
                route: routesMap['invite-friends'],
            })
        }
    }

    let desktopItems: TournamentNavItem[] = []
    let bottomNavLeft: TournamentNavItem[] = []
    let bottomNavRight: TournamentNavItem[] = []

    if (isTournamentStarted) {
        desktopItems = [leaderboard, openMatches, closedBets]
        bottomNavLeft = [leaderboard]
        bottomNavRight = [closedBets]
    } else {
        desktopItems = [
            leaderboard,
            openQuestions,
            openGroupStandings,
            openMatches,
        ]
        bottomNavLeft = [leaderboard, openQuestions]
        bottomNavRight = [openGroupStandings]
    }

    return {
        showHomeRegistration,
        desktopItems,
        managerItems,
        bottomNavLeft,
        bottomNavFab: openMatches,
        bottomNavRight,
        overflowItems: managerItems,
    }
}

export default useTournamentNavItems
