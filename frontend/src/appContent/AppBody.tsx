import React from 'react';
import AppContent from '../appContent/AppContent';
import AppLinks from '../appLinks/AppLinksProvider';
import TournamentPrizes from '../prizes/Prizes';


function AppBody() {
	return (
		<div className="container-fluid text-center">
			<div className="row content">
				<div className="col-sm-2 sidenav">
					<AppLinks />
				</div>
				<div className="col-sm-8 text-left">
					<AppContent />
				</div>
				<div className="col-sm-2 sidenav">
					<TournamentPrizes />
				</div>
			</div>
		</div>
	);
}

export default AppBody;