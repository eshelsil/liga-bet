import React from 'react';
import { useTranslation } from 'react-i18next';
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
	const { t } = useTranslation('tournamentConfig')
	const { goToTournamentConfig } = useGoTo()

	return (
		<div className='LB-ScoresConfigPage'>
			<div className='ScoresConfigPage-header'>
				<h1 className='title LB-TitleText'>{t('scoresConfigPage.title')}</h1>
				<div className='LB-FloatingFrame' style={{paddingRight: 0, paddingBottom: 2}}>
					<ul>
						<li>{t('scoresConfigPage.warning')}</li>
					</ul>
				</div>
				<div className='scoreFormContainer'>
					<h3 className='scoreFormTitle LB-TitleText'>
						{t('scoresConfigPage.scoreSettings')}
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
						{t('scoresConfigPage.back')}
					</Button>
				</div>
			</div>
		</div>
	);
}


export default ScoresConfigPage;