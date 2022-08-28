import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'
import AppHeader from './AppHeaderView';
import { AppHeaderSelector } from '../_selectors';



function AppHeaderProvider(){
	const location = useLocation();
	const { isTournamentStarted, currentUserName } = useSelector(AppHeaderSelector);
	const currentRoute = location.pathname.substring(1);

	return (
		<AppHeader {
			...{
				currentUserName,
				isTournamentStarted,
				currentRoute,
			}
		} />
	);
}

export default AppHeaderProvider;