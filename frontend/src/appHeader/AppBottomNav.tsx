import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import ScoreboardOutlinedIcon from '@mui/icons-material/ScoreboardOutlined'
import ScoreboardIcon from '@mui/icons-material/Scoreboard'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import QuizIcon from '@mui/icons-material/Quiz'
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import { UtlWithTournament } from '../types'
import useTournamentNavItems, { TournamentNavItem } from './useTournamentNavItems'
import BottomNavItem from './BottomNavItem'
import BottomNavFab from './BottomNavFab'
import useActivePath from '../hooks/useActivePath'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import { LiveGamesIds } from '../_selectors'
import './AppBottomNav.scss'

const navIcons: Record<
    string,
    { default: React.ReactNode; active: React.ReactNode }
> = {
    leaderboard: {
        default: <LeaderboardOutlinedIcon />,
        active: <LeaderboardIcon />,
    },
    'closed-bets': {
        default: <ScoreboardOutlinedIcon />,
        active: <ScoreboardIcon />,
    },
    'open-questions': {
        default: <QuizOutlinedIcon />,
        active: <QuizIcon />,
    },
    'open-group-standings': {
        default: <FormatListNumberedOutlinedIcon />,
        active: <FormatListNumberedIcon />,
    },
}

interface Props {
    currentUtl: UtlWithTournament
    isTournamentStarted: boolean
}

function BottomNavTabItem({
    item,
    showLive,
}: {
    item: TournamentNavItem
    showLive?: boolean
}) {
    const history = useHistory()
    const icons = navIcons[item.id]
    const isActive = useActivePath(item.route.path)

    const handleClick = () => {
        if (item.onClick) {
            item.onClick()
        } else {
            history.push(`/${item.route.path}`)
        }
    }

    return (
        <BottomNavItem
            label={item.route.label}
            icon={icons.default}
            activeIcon={icons.active}
            isActive={isActive}
            notifications={item.notifications}
            showLive={showLive}
            onClick={handleClick}
        />
    )
}

function AppBottomNav({ currentUtl, isTournamentStarted }: Props) {
    const history = useHistory()
    const themeClass = useTournamentThemeClass()
    const liveGameIds = useSelector(LiveGamesIds)
    const hasLiveGames = liveGameIds.length > 0

    const {
        bottomNavLeft,
        bottomNavFab,
        bottomNavRight,
    } = useTournamentNavItems(currentUtl, isTournamentStarted)

    const isFabActive = useActivePath(bottomNavFab.route.path)

    const handleFabClick = () => {
        history.push(`/${bottomNavFab.route.path}`)
    }

    if (bottomNavLeft.length === 0) {
        return null
    }

    return (
        <nav className={`LigaBet-AppBottomNav ${themeClass}`}>
            <div className="AppBottomNav-bar">
                <div className="AppBottomNav-slots">
                    <div className="AppBottomNav-group">
                        <div className="AppBottomNav-side AppBottomNav-side--left">
                            {bottomNavLeft.map((item) => (
                                <BottomNavTabItem key={item.id} item={item} />
                            ))}
                        </div>
                        <div className="AppBottomNav-center">
                            <BottomNavFab
                                label={bottomNavFab.route.label}
                                icon={<SportsSoccerIcon />}
                                isActive={isFabActive}
                                notifications={bottomNavFab.notifications}
                                onClick={handleFabClick}
                            />
                        </div>
                        <div className="AppBottomNav-side AppBottomNav-side--right">
                            {bottomNavRight.map((item) => (
                                <BottomNavTabItem
                                    key={item.id}
                                    item={item}
                                    showLive={
                                        hasLiveGames && item.id === 'closed-bets'
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default AppBottomNav
