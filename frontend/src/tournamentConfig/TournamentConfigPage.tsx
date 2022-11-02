import React from 'react';
import { useSelector} from 'react-redux';
import { TournamentStatus } from '../types';
import { AnsweredUseDefaultScoreDialog, TournamentStatusSelector } from '../_selectors';
import PrizesConfig from './prizes/PrizesConfigProvider';
import UseDefaultConfigQuestion from './UseDefaultConfigQuestion';
import './TournamentConfig.scss';


function TournamentConfigPage(){
	const tournamentStatus = useSelector(TournamentStatusSelector);
	const answeredDefaultScoreDialog = useSelector(AnsweredUseDefaultScoreDialog);

	const hasTournamentStarted = tournamentStatus !== TournamentStatus.Initial

	return (
		<div className='LB-TournamentConfigPage'>
			{!hasTournamentStarted && (
				<>
					{!answeredDefaultScoreDialog && (
						<UseDefaultConfigQuestion />
					)}
					{answeredDefaultScoreDialog && (
						<PrizesConfig />
					)}
				</>
			)}
			{hasTournamentStarted && (
				<h2>הגדרות טורניר לא זמינות אחרי שהטורניר כבר התחיל</h2>
			)}
		</div>
	);
}


export default TournamentConfigPage;