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
    callback?: () => void
    simpleLink?: boolean
}

function LinkMenuItem({
    route,
    currentPath,
    onClick,
    icon,
    className,
    callback,
    simpleLink,
}: Props) {
    const history = useHistory()
    const { label, path } = route
    const isActive = currentPath === path
    const goToRoute = () => {
        if (simpleLink){
            window.location = `/${path}` as any
            return
        }
        history.push(`/${path}`)
    }
    const action = onClick ?? goToRoute
    const onRouteClick = (e) => {
        e.preventDefault()
        action()
        if (callback) {
            callback()
        }
    }
    return (
        <MenuItemMUI className={`LigaBet-LinkMenuItem ${className || ''} ${isActive ? 'active' : ''}`} onClick={onRouteClick}>
            {icon && (
                <>
                    {icon}
                    <span /* space */ style={{ width: 5 }} />
                </>
            )}
            <div className={'itemLabel'}>
                {label}
            </div>
        </MenuItemMUI>
    )
}

export default LinkMenuItem
