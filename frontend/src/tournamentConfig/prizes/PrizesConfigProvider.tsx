import React from 'react';
import { useSelector, connect } from 'react-redux';
import {
	updatePrizesConfig,
	revertOpenTournament,
} from '../../_actions/tournament';
import { NoSelector, PrizesSelector } from '../../_selectors';
import PrizesConfig from './PrizesConfig';
import './PrizesConfig.scss';


function PrizesConfigProvider({
	updatePrizesConfig,
	revertOpenTournament,
}: {
	updatePrizesConfig: (prizes: string[] ) => Promise<void>,
	revertOpenTournament: () => Promise<void>,
}){
	const prizes = useSelector(PrizesSelector);

	return (
		<PrizesConfig
			prizes={prizes}
			updatePrizes={updatePrizesConfig}
			revertOpenTournament={revertOpenTournament}
		/>
	);
}

const mapDispatchToProps = {
	updatePrizesConfig,
	revertOpenTournament,
}


export default connect(NoSelector, mapDispatchToProps)(PrizesConfigProvider);