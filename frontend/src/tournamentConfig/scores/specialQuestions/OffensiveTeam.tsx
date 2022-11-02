import React from 'react';
import { Collapse } from '@mui/material';
import { SpecialQuestionConfigProps } from '../../types';
import TakanonPreviewModal from '../../takanonPreview/TakanonPreviewModal';
import OffensiveTeamRules from '../../../takanon/specialQuestions/OffensiveTeamRules';
import ScoreInput from '../ScoreInput';
import SpecialQuestionHeader from './SpecialQuestionHeader';
import OffensiveTeamExplanation from './explanations/OffensiveTeamExplanation';


const OFFENSIVE_TEAM_WINNING_STRING = 'ניחוש נכון';

function OffensiveTeamConfig({disabled, ...formProps}: SpecialQuestionConfigProps){
	const { watch, register, errors, clearErrors, setValue } = formProps;
	const onChange = (event: any, value: boolean) => {
		setValue('specialQuestionFlags.offensiveTeam', value as never);
	}
	const isOn = watch('specialQuestionFlags.offensiveTeam');
	const scoreConfig = watch('specialBets.offensiveTeam');
	return (
		<div className='LigaBet-MVPConfig configContainer'>
			<SpecialQuestionHeader
				title={'ההתקפה החזקה בשלב הבתים'}
				tooltipContent={<OffensiveTeamExplanation />}
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
							...register('specialBets.offensiveTeam'),
							disabled,
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