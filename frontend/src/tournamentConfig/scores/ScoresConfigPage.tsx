import React from 'react';
import { Button } from '@mui/material';
import { TournamentScoreConfig } from '../../types';
import ScoreConfigFormView from './ScoreConfigForm';
import useGoTo from '../../hooks/useGoTo';




interface Props {
	scoreConfig: TournamentScoreConfig,
	updateScoreConfig: (params: TournamentScoreConfig) => Promise<void>,
}

function ScoresConfigPage({
	scoreConfig,
	updateScoreConfig,
}: Props){
	const { goToTournamentConfig } = useGoTo()

	return (
		<div className='LB-ScoresConfigPage'>
			<div className='ScoresConfigPage-header'>
				<h1 className='title'>חוקי הטורניר</h1>
				<ul>
					<li>שים לב! לאחר שיתחיל הטורניר - לא יהיה ניתן יותר לערוך את שיטת הניקוד</li>
				</ul>
				<div className='scoreFormContainer'>
					<h3 className='scoreFormTitle'>
						הגדרות ניקוד
					</h3>
					<ScoreConfigFormView config={scoreConfig} updateConfig={updateScoreConfig}/>
					<Button
						variant='outlined'
						color='primary'
						onClick={goToTournamentConfig}
					>
						חזור
					</Button>
				</div>
			</div>
		</div>
	);
}


export default ScoresConfigPage;