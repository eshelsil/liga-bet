import React from 'react';
import AppLinks from '../appLinks/AppLinksProvider';
import AppContent from '../appContent/AppContent';
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
