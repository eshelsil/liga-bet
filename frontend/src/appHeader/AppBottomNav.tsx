import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import QuizIcon from '@mui/icons-material/Quiz'
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { UtlWithTournament } from '../types'
import useTournamentNavItems, { TournamentNavItem } from './useTournamentNavItems'
import BottomNavItem from './BottomNavItem'
import BottomNavFab from './BottomNavFab'
import AppBottomNavMore from './AppBottomNavMore'
import useActivePath from '../hooks/useActivePath'
import { useTournamentThemeClass } from '../hooks/useThemeClass'
import './AppBottomNav.scss'

const navIcons: Record<
    string,
    { default: React.ReactNode; active: React.ReactNode }
> = {
    leaderboard: {
        default: <EmojiEventsOutlinedIcon />,
        active: <EmojiEventsIcon />,
    },
    'closed-bets': {
        default: <VisibilityOutlinedIcon />,
        active: <VisibilityIcon />,
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

function BottomNavMoreButton({ onClick }: { onClick: () => void }) {
    return (
        <BottomNavItem
            label="עוד"
            icon={<MoreHorizIcon />}
            onClick={onClick}
        />
    )
}

function BottomNavTabItem({ item }: { item: TournamentNavItem }) {
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
            icon={icons?.default ?? <MoreHorizIcon />}
            activeIcon={icons?.active}
            isActive={isActive}
            notifications={item.notifications}
            onClick={handleClick}
        />
    )
}

function AppBottomNav({ currentUtl, isTournamentStarted }: Props) {
    const history = useHistory()
    const themeClass = useTournamentThemeClass()
    const [moreOpen, setMoreOpen] = useState(false)

    const {
        bottomNavLeft,
        bottomNavFab,
        bottomNavRight,
        overflowItems,
    } = useTournamentNavItems(currentUtl, isTournamentStarted)

    const isFabActive = useActivePath(bottomNavFab.route.path)

    const handleFabClick = () => {
        history.push(`/${bottomNavFab.route.path}`)
    }

    const showMore = overflowItems.length > 0 && isTournamentStarted

    if (bottomNavLeft.length === 0) {
        return null
    }

    return (
        <>
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
                                    <BottomNavTabItem key={item.id} item={item} />
                                ))}
                                {showMore && (
                                    <BottomNavMoreButton
                                        onClick={() => setMoreOpen(true)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <AppBottomNavMore
                open={moreOpen}
                onClose={() => setMoreOpen(false)}
                items={overflowItems}
            />
        </>
    )
}

export default AppBottomNav
