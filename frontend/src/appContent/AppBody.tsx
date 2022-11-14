import React from 'react';
import AppContent from '../appContent/AppContent';
import TournamentPrizes from '../prizes/PrizesProvider';
import AppFooter from '../appFooter/Footer';
import './AppBody.scss';


function AppBody() {
	return (
		<div className="LigaBet-AppBody">
			<div className='AppContent'>
				<AppContent />
			</div>
			<TournamentPrizes />
			<AppFooter />
		</div>
	);
}

export default AppBody
