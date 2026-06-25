import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { AnsweredUseDefaultScoreDialog, NoSelector } from '../_selectors';
import useGoTo from '../hooks/useGoTo';
import { answerDefaultConfigQuestion } from '../_actions/tournament';
import { connect } from 'react-redux';


function UseDefaultConfigQuestion({
	answerDefaultConfigQuestion,
	onUseDefaultScore,
}){
	const { t } = useTranslation('tournamentConfig')
	const { goToScoresConfig, goToOpenQuestionBets } = useGoTo()
	const answeredDefaultScoreDialog = useSelector(AnsweredUseDefaultScoreDialog)
	const [keepDefaultConfig, setKeepDefaultConfig] = useState(true)
	
	const saveAnswer = () => {
		if (keepDefaultConfig){
			if (!answeredDefaultScoreDialog){
				goToOpenQuestionBets()
			}
			onUseDefaultScore()
		} else {
			goToScoresConfig()
		}
		answerDefaultConfigQuestion()
			.catch(()=>{})
	}

	return (
		<div className='LB-UseDefaultConfigQuestion'>
			<h2 className='LB-TitleText'>{t('useDefaultConfig.title')}</h2>
			<div className='LB-FloatingFrame'>
				<div className='DefaultConfigQuestion-text'>
					{t('useDefaultConfig.description')}
				</div>
				<div className='UseDefaultConfigQuestion-buttons'>
					<FormControl variant='outlined'>
						<RadioGroup
							className='radioSelection'
							row
							value={keepDefaultConfig ? 'default' : 'custom'}
							onChange={(e) => setKeepDefaultConfig(e.target.value === 'default')}
							name="useDefaultConfig"
						>
							<FormControlLabel
								value={'default'}
								control={<Radio />}
								label={t('useDefaultConfig.goWithIt')}
								style={{marginInlineEnd: 24}}
							/>
							<FormControlLabel
								value={'custom'}
								control={<Radio />}
								label={t('useDefaultConfig.wantToChange')}
							/>
						</RadioGroup>
					</FormControl>
					<div className='continueBtnBontainer'>
						<Button variant="contained" color="primary" onClick={saveAnswer}>
							{t('useDefaultConfig.continue')}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

const mapDispatchToState = {
	answerDefaultConfigQuestion,
}


export default connect(NoSelector, mapDispatchToState)(UseDefaultConfigQuestion);