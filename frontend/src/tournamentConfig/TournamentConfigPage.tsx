import React from 'react';
import { useSelector} from 'react-redux';
import { TournamentStatus } from '../types';
import { TournamentStatusSelector } from '../_selectors';
import PrizesConfig from './prizes/PrizesConfigProvider';
import ScoresConfig from './scores/ScoresConfigPageProvider';
import './TournamentConfig.scss';


function TournamentConfigPage(){
	const tournamentStatus = useSelector(TournamentStatusSelector);

	return (
		<div className='LB-TournamentConfigPage'>
			{tournamentStatus === TournamentStatus.Initial && (
				<ScoresConfig />
			)}
			{tournamentStatus === TournamentStatus.OpenForBets && (
				<PrizesConfig />
			)}
			{![TournamentStatus.OpenForBets, TournamentStatus.Initial].includes(tournamentStatus) && (
				<h2>הגדרות טורניר לא זמינות אחרי שהטורניר כבר התחיל</h2>
			)}
		</div>
	);
}


export default TournamentConfigPage;