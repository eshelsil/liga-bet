import React from 'react';
import { Collapse } from '@mui/material';
import { ScoreConfigFormProps } from '../../types';
import TakanonPreviewModal from '../../takanonPreview/TakanonPreviewModal';
import MostAssistsRules from '../../../takanon/specialQuestions/MostAssistsRules';
import ScoreInput from '../ScoreInput';
import SpecialQuestionHeader from './SpecialQuestionHeader';


const TOP_ASSISTS_WINNING_STRING = 'ניחוש נכון';

function TopAssistsConfig(formProps: ScoreConfigFormProps){
	const { watch, register, errors, clearErrors, setValue } = formProps;
	const onChange = (event: any, value: boolean) => {
		setValue('chosenSpecialQuestions.topAssists', value as never);
	}
	const isOn = watch('chosenSpecialQuestions.topAssists');
	const scoreConfig = watch('specialBets.topAssists');
	return (
		<div className='LigaBet-TopAssists configContainer'>
			<SpecialQuestionHeader
				title={'מלך בישולים'}
				tooltipContent='any content'
				switchProps={{
					checked: isOn,
					onChange: onChange,
				}}
			/>
			<Collapse in={isOn}>
				<div className='configRow'>
					<p className={'configLabel'}>
						{TOP_ASSISTS_WINNING_STRING}
					</p>
					<ScoreInput
						error={errors.specialBets?.topAssists?.message}
						InputProps={{
							...register('specialBets.topAssists')
						}}
						clearErrors={() => clearErrors('specialBets.topAssists')}
					/>
				</div>
				<TakanonPreviewModal>
					<MostAssistsRules score={scoreConfig} />
				</TakanonPreviewModal>
			</Collapse>
		</div>
	);
}


export default TopAssistsConfig;