import React from 'react';
import { UtlWithTournament } from '../types';
import UserMenuView from './UserMenuView';
import TournamentMenu from './TournamentMenu';
import './style.scss';


interface Props {
	currentUtl: UtlWithTournament,
	currentUsername: string,
	isTournamentStarted: boolean,
	currentRoute: string,
	goToUserPage: () => void,
	goToUtlPage: () => void,
	deselectUtl: () => void,
}

function AppHeader({
	isTournamentStarted,
	currentUtl,
	currentUsername,
	currentRoute,
	goToUserPage,
	goToUtlPage,
	deselectUtl,
}: Props){
	return (
		<div className='LigaBet-AppHeader'>
			<UserMenuView {...{
				deselectUtl,
				currentRoute,
				currentUsername,
				goToUserPage,
			}} />
			{!!currentUtl && (
				<TournamentMenu {...{
					currentUtl,
					currentRoute,
					goToUtlPage,
					isTournamentStarted,
				}} />
			)}
		</div>
	);
}

export default AppHeader;