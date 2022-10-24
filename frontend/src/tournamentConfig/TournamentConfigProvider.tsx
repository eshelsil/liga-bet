import React from 'react';
import { useSelector, connect } from 'react-redux';
import { TournamentScoreConfig } from '../types';
import {
	updateScoreConfig
} from '../_actions/tournament';
import { NoSelector, ScoresConfigSelector, PrizesSelector } from '../_selectors';
import TournamentConfig from './TournamentConfigView';
import './TournamentConfig.scss';


function TournamentConfigProvider({
	updateScoreConfig
}: {
	updateScoreConfig: (config: TournamentScoreConfig ) => Promise<void>,
}){
	const scoresConfig = useSelector(ScoresConfigSelector);
	console.log({scoresConfig})
	const prizes = useSelector(PrizesSelector);

	return (
		<TournamentConfig
			scoreConfig={scoresConfig}
			prizes={prizes}
			updateScoreConfig={updateScoreConfig}
		/>
	);
}

const mapDispatchToProps = {
	updateScoreConfig
}


export default connect(NoSelector, mapDispatchToProps)(TournamentConfigProvider);