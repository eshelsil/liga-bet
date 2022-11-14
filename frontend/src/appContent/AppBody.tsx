import React from 'react';
import AppContent from '../appContent/AppContent';
import TournamentPrizes from '../prizes/PrizesProvider';
import './AppBody.scss';


function AppBody() {
	return (
		<div className="LigaBet-AppBody">
			<div className='AppContent'>
				<AppContent />
			</div>
			<TournamentPrizes />
		</div>
	);
}

export default AppBody
