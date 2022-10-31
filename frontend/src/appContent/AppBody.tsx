import { Grid } from '@mui/material';
import React from 'react';
import AppContent from '../appContent/AppContent';
import AppLinks from '../appLinks/AppLinksProvider';
import TournamentPrizes from '../prizes/PrizesProvider';
import './AppBody.scss';


function AppBody() {
	return (
		<div className="LigaBet-AppBody">
			<AppLinks />
			<div className='AppContent'>
				<AppContent />
			</div>
			<TournamentPrizes />
		</div>
	);
}

export default AppBody
