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
}: {
	updatePrizesConfig: (prizes: string[] ) => Promise<void>,
}){
	const prizes = useSelector(PrizesSelector);

	return (
		<PrizesConfig
			prizes={prizes}
			updatePrizes={updatePrizesConfig}
		/>
	);
}

const mapDispatchToProps = {
	updatePrizesConfig,
}


export default connect(NoSelector, mapDispatchToProps)(PrizesConfigProvider);