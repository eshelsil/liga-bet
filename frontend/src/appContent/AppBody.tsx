import React from 'react';
import AppContent from '../appContent/AppContent';
import TournamentPrizes from '../prizes/PrizesProvider';
import TakanonLink from '../prizes/TakanonLink';
import AppFooter from '../appFooter/Footer';
import './AppBody.scss';


function AppBody() {
	return (
		<div className="LigaBet-AppBody">
			<div className='AppContent'>
				<AppContent />
			</div>
			<TournamentPrizes />
			<TakanonLink />
			<AppFooter />
		</div>
	);
}

export default AppBody
