import React from 'react';
import { useSelector, connect } from 'react-redux';
import { TournamentScoreConfig } from '../../types';
import {
	updateScoreConfig
} from '../../_actions/tournament';
import { NoSelector, ScoresConfigSelector } from '../../_selectors';
import ScoresConfigPage from './ScoresConfigPage';
import './ScoresConfig.scss';


function ScoresConfigPageProvider({
	updateScoreConfig,
}: {
	updateScoreConfig: (config: TournamentScoreConfig ) => Promise<void>,
}){
	const scoresConfig = useSelector(ScoresConfigSelector);

	return (
		<ScoresConfigPage
			scoreConfig={scoresConfig}
			updateScoreConfig={updateScoreConfig}
		/>
	);
}

const mapDispatchToProps = {
	updateScoreConfig,
}


export default connect(NoSelector, mapDispatchToProps)(ScoresConfigPageProvider);