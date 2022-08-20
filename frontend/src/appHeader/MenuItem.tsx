import React, { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import { Route } from './types';


interface Props {
	route: Route,
	currentPath: string,
	onClick?: () => void,
	icon?: ReactNode,
}

function MenuItem({
	route,
	currentPath,
	onClick,
	icon,
}: Props){
	const history = useHistory();
	const {iconClass, label, path} = route;
	const isActive = currentPath === path;
	const goToRoute = () => history.push(`/${path}`);
	const action = onClick ?? goToRoute;
	const onRouteClick = (e) => {
		e.preventDefault();
		action();
	}
	return <li className={isActive ? "active" : ""}>
		<a href={`/${route}`} onClick={onRouteClick}>
			{icon && (icon)}
			{!icon && iconClass && (
				<div className={`icon ${iconClass}`} />
			)}
			<span className="menu-label">{label}</span>
		</a>
	</li>
}


export default MenuItem;