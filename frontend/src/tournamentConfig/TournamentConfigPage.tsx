import React, { useState } from 'react';
import { useSelector} from 'react-redux';
import { TournamentStatus } from '../types';
import { AnsweredUseDefaultScoreDialog, TournamentStatusSelector } from '../_selectors';
import TournamentConfigPageContent from './TournamentConfigPageContent';
import UseDefaultConfigQuestion from './UseDefaultConfigQuestion';
import './TournamentConfig.scss';
import '../takanon/TakanonStyle';


function TournamentConfigPage(){
	const tournamentStatus = useSelector(TournamentStatusSelector);
	const answeredDefaultScoreDialog = useSelector(AnsweredUseDefaultScoreDialog);
	const [showDefaultScoreQuestion, setShowDefaultScoreQuestion] = useState(!answeredDefaultScoreDialog)

	const hasTournamentStarted = tournamentStatus !== TournamentStatus.Initial

	return (
		<div className='LB-TournamentConfigPage'>
			{showDefaultScoreQuestion && (
				<UseDefaultConfigQuestion onUseDefaultScore={()=> setShowDefaultScoreQuestion(false)}/>
			)}
			{!showDefaultScoreQuestion && (
				<TournamentConfigPageContent onGoToScoresClick={() => setShowDefaultScoreQuestion(true)}/>
			)}
		</div>
	);
}


export default TournamentConfigPage;