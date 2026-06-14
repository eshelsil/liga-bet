import React, { ReactNode } from 'react'
import { Badge } from '@mui/material'

interface Props {
    label: string
    icon: ReactNode
    activeIcon?: ReactNode
    isActive?: boolean
    notifications?: number
    onClick: () => void
}

function BottomNavItem({
    label,
    icon,
    activeIcon,
    isActive: isActiveProp,
    notifications,
    onClick,
}: Props) {
    const isActive = isActiveProp ?? false

    const iconContent = (
        <span className={`BottomNavItem-icon ${isActive ? 'active' : ''}`}>
            {isActive && activeIcon ? activeIcon : icon}
        </span>
    )

    return (
        <button
            type="button"
            className={`BottomNavItem ${isActive ? 'BottomNavItem--active' : ''}`}
            onClick={onClick}
        >
            {notifications > 0 ? (
                <Badge color="error" badgeContent={notifications}>
                    {iconContent}
                </Badge>
            ) : (
                iconContent
            )}
            <span className="BottomNavItem-label">{label}</span>
        </button>
    )
}

export default BottomNavItem
