import React from 'react';
import { Button } from '@mui/material';
import ScoreConfigFormView from './ScoreConfigForm';
import useGoTo from '../../hooks/useGoTo';
import { ScoresConfigFromatted } from '../../_selectors';




interface Props {
	scoreConfig: ScoresConfigFromatted,
	updateScoreConfig: (params: ScoresConfigFromatted) => Promise<void>,
}

function ScoresConfigPage({
	scoreConfig,
	updateScoreConfig,
}: Props){
	const { goToTournamentConfig } = useGoTo()

	return (
		<div className='LB-ScoresConfigPage'>
			<div className='ScoresConfigPage-header'>
				<h1 className='title LB-TitleText'>חוקי הטורניר</h1>
				<div className='LB-FloatingFrame' style={{paddingRight: 0, paddingBottom: 2}}>
					<ul>
						<li>שים לב! לאחר שיתחיל הטורניר - לא יהיה ניתן יותר לערוך את שיטת הניקוד</li>
					</ul>
				</div>
				<div className='scoreFormContainer'>
					<h3 className='scoreFormTitle LB-TitleText'>
						הגדרות ניקוד
					</h3>
					<ScoreConfigFormView config={scoreConfig} updateConfig={updateScoreConfig}/>
					<Button
						variant='contained'
						onClick={goToTournamentConfig}
						style={{
							backgroundColor: 'rgb(200,200,200)',
							color: '#000',
						}}
					>
						חזור
					</Button>
				</div>
			</div>
		</div>
	);
}


export default ScoresConfigPage;