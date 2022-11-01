import React from 'react';
import { Button } from '@mui/material';
import { TournamentScoreConfig } from '../../types';
import ScoreConfigFormView from './ScoreConfigForm';




interface Props {
	scoreConfig: TournamentScoreConfig,
	updateScoreConfig: (params: TournamentScoreConfig) => Promise<void>,
}

function ScoresConfigPage({
	scoreConfig,
	updateScoreConfig,
}: Props){

	const hasScoreConfig = !!scoreConfig

	return (
		<div className='LB-ScoresConfigPage'>
			<h1 className='title'>חוקי הטורניר</h1>
			<ul>
				<li>לאחר שתיקבע את שיטת הניקוד תוכל להתחיל את הטורניר</li>
				<li>לאחר שתתחיל את הטורניר, ההימורים יפתחו</li>
				<li>שים לב! לאחר שתפתח את הטורניר - לא יהיה ניתן יותר לערוך את שיטת הניקוד</li>
			</ul>
			<div className='scoreFormContainer'>
				<h3 className='scoreFormTitle'>
					הגדרות ניקוד
				</h3>
				<ScoreConfigFormView config={scoreConfig} updateConfig={updateScoreConfig}/>
			</div>
			{hasScoreConfig && (
				<div className='statusActionContainer'>
					<Button
						variant='contained'
						color='primary'
					>
						התחל את הטורניר
					</Button>
					<h4><b>שים לב!</b> לאחר שתפתח את הטורניר להימורים לא תוכל לשנות יותר את הגדרות הניקוד</h4>
				</div>
			)}
		</div>
	);
}


export default ScoresConfigPage;