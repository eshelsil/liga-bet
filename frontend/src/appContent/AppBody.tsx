import { Grid } from '@mui/material';
import React from 'react';
import AppContent from '../appContent/AppContent';
import AppLinks from '../appLinks/AppLinksProvider';
import TournamentPrizes from '../prizes/PrizesProvider';
import './AppBody.scss';


function AppBody() {
	return (
		<Grid container className="LigaBet-AppBody">
			<Grid item md={1} className="sidenav">
				<AppLinks />
			</Grid>
			<Grid item md={9} className="LigaBet-CenterGrid">
				<AppContent />
			</Grid>
			<Grid item md={2} className="sidenav">
				<TournamentPrizes />
			</Grid>
		</Grid>
	);
}

export default AppBody
