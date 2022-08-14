import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { HasCurrentUtl } from '../_selectors';


export interface AppLinkProps {
	path: string,
	label: string,
	hasReactComponent?: boolean,
}

function AppLink({path, label, hasReactComponent = false}: AppLinkProps){
	const hasCurrentUtl = useSelector(HasCurrentUtl);
	const history = useHistory();
	const onClick = (e) =>{
		e.preventDefault();
		history.push(path);
	}
	if (!hasCurrentUtl){
		return null;
	}
	return (
		<p>
			<a href={path} onClick={hasReactComponent ? onClick : undefined} >
				{label}
			</a>
		</p>
	);
}

export default AppLink;