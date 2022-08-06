import React from 'react';
import { useHistory } from 'react-router';


export interface AppLinkProps {
	path: string,
	label: string,
	hasReactComponent?: boolean,
}

function AppLink({path, label, hasReactComponent = false}: AppLinkProps){
	const history = useHistory();
	const onClick = (e) =>{
		e.preventDefault();
		history.push(path);
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