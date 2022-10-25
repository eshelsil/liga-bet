import React from 'react';
import { useSelector, connect } from 'react-redux';
import { TournamentScoreConfig, TournamentStatus } from '../types';
import {
	openTournament,
	revertOpenTournament,
	updateScoreConfig
} from '../_actions/tournament';
import { NoSelector, ScoresConfigSelector, PrizesSelector, CurrentTournament } from '../_selectors';
import TournamentConfig from './TournamentConfigView';
import './TournamentConfig.scss';


function TournamentConfigProvider({
	updateScoreConfig,
	openTournamentForBets,
	revertOpenTournament,
}: {
	updateScoreConfig: (config: TournamentScoreConfig ) => Promise<void>,
	openTournamentForBets: () => Promise<void>,
	revertOpenTournament: () => Promise<void>,
}){
	const scoresConfig = useSelector(ScoresConfigSelector);
	const prizes = useSelector(PrizesSelector);
	const tournament = useSelector(CurrentTournament);

	return (
		<TournamentConfig
			scoreConfig={scoresConfig}
			prizes={prizes}
			updateScoreConfig={updateScoreConfig}
			openTournamentForBets={openTournamentForBets}
			revertOpenTournament={revertOpenTournament}
			tournamentStatus={tournament?.status}
		/>
	);
}

const mapDispatchToProps = {
	updateScoreConfig,
	openTournamentForBets: openTournament,
	revertOpenTournament,
}


export default connect(NoSelector, mapDispatchToProps)(TournamentConfigProvider);