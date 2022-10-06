import { Grid } from '@mui/material';
import React from 'react';
import AppContent from '../appContent/AppContent';
import AppLinks from '../appLinks/AppLinksProvider';
import TournamentPrizes from '../prizes/Prizes';
import './AppBody.scss';


function AppBody() {
	return (
		<Grid container className="LigaBet-AppBody">
			<Grid item sm={2} className="sidenav">
				<TournamentPrizes />
			</Grid>
			<Grid item sm={8} className="text-left">
				<AppContent />
			</Grid>
			<Grid item sm={2} className="sidenav">
				<AppLinks />
			</Grid>
		</Grid>
	);
}

export default AppBody;