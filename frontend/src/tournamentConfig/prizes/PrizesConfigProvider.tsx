import React from 'react';
import { useSelector, connect } from 'react-redux';
import {
	updatePrizesConfig,
} from '../../_actions/tournament';
import { NoSelector, PrizesSelector } from '../../_selectors';
import PrizesConfig from './PrizesConfig';
import './PrizesConfig.scss';


function PrizesConfigProvider({
	updatePrizesConfig,
	onGoToScoresClick,
}: {
	updatePrizesConfig: (prizes: string[] ) => Promise<void>,
	onGoToScoresClick: () => void,
}){
	const prizes = useSelector(PrizesSelector);

	return (
		<PrizesConfig
			prizes={prizes}
			updatePrizes={updatePrizesConfig}
			onGoToScoresClick={onGoToScoresClick}
		/>
	);
}

const mapDispatchToProps = {
	updatePrizesConfig,
}


export default connect(NoSelector, mapDispatchToProps)(PrizesConfigProvider);