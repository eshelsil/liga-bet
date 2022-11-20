import React from 'react';
import { useSelector, connect } from 'react-redux';
import { TournamentScoreConfig } from '../../types';
import {
	updateScoreConfig
} from '../../_actions/tournament';
import { IsTournamentStarted, NoSelector, ScoresConfigSelector } from '../../_selectors';
import ScoresConfigPage from './ScoresConfigPage';
import './ScoresConfig.scss';


function ScoresConfigPageProvider({
	updateScoreConfig,
}: {
	updateScoreConfig: (config: TournamentScoreConfig ) => Promise<void>,
}){
	const scoresConfig = useSelector(ScoresConfigSelector);
	const hasTournamentStarted = useSelector(IsTournamentStarted)

	return (
		<div>
			{!hasTournamentStarted && (
				<ScoresConfigPage
					scoreConfig={scoresConfig}
					updateScoreConfig={updateScoreConfig}
				/>
			)}
			{hasTournamentStarted && (
				<h2 className='LB-TitleText'>הגדרות טורניר לא זמינות אחרי שהטורניר כבר התחיל</h2>
			)}
		</div>
	);
}

const mapDispatchToProps = {
	updateScoreConfig,
}


export default connect(NoSelector, mapDispatchToProps)(ScoresConfigPageProvider);