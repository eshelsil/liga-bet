import React, { ReactNode } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { Route } from './types'
import MenuItemMUI from '@mui/material/MenuItem'

interface Props {
    route: Route
    currentPath: string
    onClick?: () => void
    icon?: ReactNode
    className?: string
    closeMenuHandler?: () => void
}

function LinkMenuItem({
    route,
    currentPath,
    onClick,
    icon,
    className,
    closeMenuHandler,
}: Props) {
    const history = useHistory()
    const { iconClass, label, path } = route
    const isActive = currentPath === path
    const goToRoute = () => history.push(`/${path}`)
    const action = onClick ?? goToRoute
    const onRouteClick = (e) => {
        e.preventDefault()
        action()
        if (closeMenuHandler) {
            closeMenuHandler()
        }
    }
    return (
        <Link
            to={`/${route}`}
            onClick={onRouteClick}
            className={`${className || ''} ${isActive ? 'active' : ''}`}
        >
            <MenuItemMUI className={'menu-item'}>
                {icon && (
                    <>
                        {icon}
                        <span /* space */ style={{ width: 5 }} />
                    </>
                )}
                {label}
            </MenuItemMUI>
        </Link>
    )
}

export default LinkMenuItem
