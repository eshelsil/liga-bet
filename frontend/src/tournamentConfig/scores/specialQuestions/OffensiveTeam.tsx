import React from 'react';
import { Collapse } from '@mui/material';
import { ScoreConfigFormProps } from '../../types';
import TakanonPreviewModal from '../../takanonPreview/TakanonPreviewModal';
import OffensiveTeamRules from '../../../takanon/specialQuestions/OffensiveTeamRules';
import ScoreInput from '../ScoreInput';
import SpecialQuestionHeader from './SpecialQuestionHeader';


const OFFENSIVE_TEAM_WINNING_STRING = 'ניחוש נכון';

function OffensiveTeamConfig(formProps: ScoreConfigFormProps){
	const { watch, register, errors, clearErrors, setValue } = formProps;
	const onChange = (event: any, value: boolean) => {
		setValue('chosenSpecialQuestions.offensiveTeam', value as never);
	}
	const isOn = watch('chosenSpecialQuestions.offensiveTeam');
	const scoreConfig = watch('specialBets.offensiveTeam');
	return (
		<div className='LigaBet-MVPConfig configContainer'>
			<SpecialQuestionHeader
				title={'ההתקפה החזקה בשלב הבתים'}
				tooltipContent='any content'
				switchProps={{
					checked: isOn,
					onChange: onChange,
				}}
			/>
			<Collapse in={isOn}>
				<div className='configRow'>
					<p className={'configLabel'}>
						{OFFENSIVE_TEAM_WINNING_STRING}
					</p>
					<ScoreInput
						error={errors.specialBets?.offensiveTeam?.message}
						InputProps={{
							...register('specialBets.offensiveTeam')
						}}
						clearErrors={() => clearErrors('specialBets.offensiveTeam')}
					/>
				</div>
				<TakanonPreviewModal>
					<OffensiveTeamRules score={scoreConfig} />
				</TakanonPreviewModal>
			</Collapse>
		</div>
	);
}


export default OffensiveTeamConfig;