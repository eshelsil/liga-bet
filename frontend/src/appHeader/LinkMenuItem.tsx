import React, { ReactNode } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { Route } from './types'
import MenuItemMUI from '@mui/material/MenuItem'
import useActivePath from '../hooks/useActivePath'
import { Badge } from '@mui/material'

interface Props {
    route: Route
    content?: ReactNode
    onClick?: () => void
    callback?: () => void
    icon?: ReactNode
    className?: string
    simpleLink?: boolean
    notifications?: number
}

function LinkMenuItem({
    route,
    content,
    onClick,
    callback,
    icon,
    className,
    simpleLink,
    notifications,
}: Props) {
    const history = useHistory()
    const { label, path } = route
    const isActive = useActivePath(path)
    const goToRoute = () => {
        if (simpleLink){
            window.location = `/${path}` as any
            return
        }
        if (!isActive) {
            history.push(`/${path}`)
        }
    }
    const action = onClick ?? goToRoute
    const onRouteClick = (e) => {
        e.preventDefault()
        action()
        callback && callback()
    }

    return (
        <MenuItemMUI className={`LigaBet-LinkMenuItem ${className || ''} ${isActive ? 'LB-ActivePathItem' : ''}`} onClick={onRouteClick}>
            {icon && (
                <>
                    {icon}
                    <span /* space */ style={{ width: 5 }} />
                </>
            )}

            {notifications > 0 ?
            (
                <Badge
                    color="error"
                    badgeContent={notifications}
                >
                    <div className={'itemLabel'}>
                        {content ?? label}
                    </div>
                </Badge>
            ) : (
                <div className={'itemLabel'}>
                    {content ?? label}
                </div>
            )}
        </MenuItemMUI>
    )
}

export default LinkMenuItem
