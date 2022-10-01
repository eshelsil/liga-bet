import React from 'react';
import { connect, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'
import { AppHeaderSelector, NoSelector } from '../_selectors';
import { resetUtlSelection } from '../_actions/tournamentUser';
import { openDialog } from '../_actions/dialogs';
import useGoTo from '../hooks/useGoTo';
import AppHeader from './AppHeaderView';
import { DialogName } from '../dialogs/types';



function AppHeaderProvider({
	openDialog,
	resetUtlSelection,
}){
	const location = useLocation();
	const { goToUserPage, goToUtlPage, goToChooseUtl } = useGoTo();
	const { isTournamentStarted, currentUsername, currentUtl } = useSelector(AppHeaderSelector);
	const currentRoute = location.pathname.substring(1);

	const deselectUtl = () => {
		resetUtlSelection();
		goToChooseUtl();
	};

	const openDialogChangePassword = () => openDialog(DialogName.ChangePassword);


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
				openDialogChangePassword,
			}
		} />
	);
}

const mapDispatchToProps = {
	resetUtlSelection,
	openDialog,
}

export default connect(NoSelector, mapDispatchToProps)(AppHeaderProvider);