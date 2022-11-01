import React from 'react';
import { useSelector} from 'react-redux';
import { TournamentStatus } from '../types';
import { TournamentStatusSelector } from '../_selectors';
import PrizesConfig from './prizes/PrizesConfigProvider';
import ScoresConfig from './scores/ScoresConfigPageProvider';
import './TournamentConfig.scss';


function TournamentConfigPage(){
	const tournamentStatus = useSelector(TournamentStatusSelector);

	const hasTournamentStarted = tournamentStatus !== TournamentStatus.Initial

	return (
		<div className='LB-TournamentConfigPage'>
			{!hasTournamentStarted && (
				<>
					<ScoresConfig />
					<PrizesConfig />
				</>
			)}
			{hasTournamentStarted && (
				<h2>הגדרות טורניר לא זמינות אחרי שהטורניר כבר התחיל</h2>
			)}
		</div>
	);
}


export default TournamentConfigPage;