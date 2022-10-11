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
		setValue('chosenSpecialQuestions.most_assists', value as never);
	}
	const isOn = watch('chosenSpecialQuestions.most_assists');
	const scoreConfig = watch('specialBets.most_assists');
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
						error={errors.specialBets?.most_assists?.message}
						InputProps={{
							...register('specialBets.most_assists')
						}}
						clearErrors={() => clearErrors('specialBets.most_assists')}
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