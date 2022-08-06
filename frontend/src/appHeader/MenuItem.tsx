import React from 'react';
import { useHistory } from 'react-router-dom';
import { Route } from './types';


interface Props {
	route: Route,
	currentPath: string,
}

function MenuItem({
	route,
	currentPath,
}: Props){
	const history = useHistory();
	const {iconClass, label, path} = route;
	const isActive = currentPath === path;
	const onClick = (e) => {
		e.preventDefault();
		history.push(`/${path}`);
	}
	return <li className={isActive ? "active" : ""}>
		<a href={`/${route}`} onClick={onClick}>
			{iconClass ? <div className={`icon ${iconClass}`}></div> : null}
			<span className="menu-label">{label}</span>
		</a>
	</li>
}


export default MenuItem;