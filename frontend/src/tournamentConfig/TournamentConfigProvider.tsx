import React from 'react';
import { useSelector, connect } from 'react-redux';
import { TournamentConfig as TypeTournamentConfig } from '../types';
import {
	updateTournamentConfig
} from '../_actions/tournament';
import { NoSelector, CurrentTournamentConfig } from '../_selectors';
import TournamentConfig from './TournamentConfigView';
import './TournamentConfig.scss';


function TournamentConfigProvider({
	updateTournamentConfig
}: {
	updateTournamentConfig: (config: Partial<TypeTournamentConfig> ) => Promise<void>,
}){
	const config = useSelector(CurrentTournamentConfig);

	return (
		<TournamentConfig
			config={config}
			updateConfig={updateTournamentConfig}
		/>
	);
}

const mapDispatchToProps = {
	updateTournamentConfig
}


export default connect(NoSelector, mapDispatchToProps)(TournamentConfigProvider);