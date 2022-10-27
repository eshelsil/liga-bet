import React from 'react';
import { useSelector, connect } from 'react-redux';
import { TournamentScoreConfig } from '../../types';
import {
	openTournament,
	updateScoreConfig
} from '../../_actions/tournament';
import { NoSelector, ScoresConfigSelector } from '../../_selectors';
import ScoresConfigPage from './ScoresConfigPage';
import './ScoresConfig.scss';


function ScoresConfigPageProvider({
	updateScoreConfig,
	openTournamentForBets,
}: {
	updateScoreConfig: (config: TournamentScoreConfig ) => Promise<void>,
	openTournamentForBets: () => Promise<void>,
}){
	const scoresConfig = useSelector(ScoresConfigSelector);

	return (
		<ScoresConfigPage
			scoreConfig={scoresConfig}
			updateScoreConfig={updateScoreConfig}
			openTournamentForBets={openTournamentForBets}
		/>
	);
}

const mapDispatchToProps = {
	updateScoreConfig,
	openTournamentForBets: openTournament,
}


export default connect(NoSelector, mapDispatchToProps)(ScoresConfigPageProvider);