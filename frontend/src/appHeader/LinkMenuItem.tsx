import React, {ReactNode} from 'react';
import {useHistory, Link} from 'react-router-dom';
import {Route} from './types';
import MenuItemMUI from '@mui/material/MenuItem'

interface Props {
    route: Route,
    currentPath: string,
    onClick?: () => void,
    icon?: ReactNode,
    className?: string
}

function LinkMenuItem({
                          route,
                          currentPath,
                          onClick,
                          icon,
                          className
                      }: Props) {
    const history = useHistory();
    const {iconClass, label, path} = route;
    const isActive = currentPath === path;
    const goToRoute = () => history.push(`/${path}`);
    const action = onClick ?? goToRoute;
    const onRouteClick = (e) => {
        e.preventDefault();

        action();
    }
    return <MenuItemMUI className={`${className || ''} ${isActive ? "active" : ""}`}>
        {icon && <>{icon}
            <span /* space */ style={{width: 5}}/></>}
        <Link to={`/${route}`} onClick={onRouteClick}>
            {label}
        </Link>
    </MenuItemMUI>
}

export default LinkMenuItem;