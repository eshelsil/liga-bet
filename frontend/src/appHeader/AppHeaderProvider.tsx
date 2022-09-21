import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom'
import { AppHeaderSelector } from '../_selectors';
import { AppDispatch } from '../_helpers/store';
import { resetUtlSelection } from '../_actions/tournamentUser';
import useGoTo from '../hooks/useGoTo';
import AppHeader from './AppHeaderView';



function AppHeaderProvider(){
	const location = useLocation();
	const { goToUserPage, goToUtlPage, goToChooseUtl } = useGoTo();
	const { isTournamentStarted, currentUsername, currentUtl } = useSelector(AppHeaderSelector);
	const currentRoute = location.pathname.substring(1);

	const dispatch: AppDispatch = useDispatch();
	const deselectUtl = () => {
		dispatch(resetUtlSelection());
		goToChooseUtl();
	};


	return (
		<AppHeader {
			...{
				isTournamentStarted,
				currentUsername,
				currentRoute,
				currentUtl,
				deselectUtl,
				goToUserPage,
				goToUtlPage,
			}
		} />
	);
}

export default AppHeaderProvider;