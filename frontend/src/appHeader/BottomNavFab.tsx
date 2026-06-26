import React, { ReactNode } from 'react'
import { Badge, Fab } from '@mui/material'

interface Props {
    label: string
    icon: ReactNode
    isActive?: boolean
    notifications?: number
    onClick: () => void
}

function BottomNavFab({
    label,
    icon,
    isActive,
    notifications,
    onClick,
}: Props) {
    const fab = (
        <Fab
            className={`BottomNavFab-button ${isActive ? 'BottomNavFab-button--active' : ''}`}
            onClick={onClick}
            aria-label={label}
        >
            {icon}
        </Fab>
    )

    return (
        <div className="BottomNavFab">
            <div className="BottomNavFab-iconWrap">
                {notifications > 0 ? (
                    <Badge
                        color="error"
                        badgeContent={notifications}
                        overlap="circular"
                        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                        className="BottomNavFab-badge"
                    >
                        {fab}
                    </Badge>
                ) : (
                    fab
                )}
            </div>
            <span className={`BottomNavFab-label ${isActive ? 'active' : ''}`}>
                {label}
            </span>
        </div>
    )
}

export default BottomNavFab
