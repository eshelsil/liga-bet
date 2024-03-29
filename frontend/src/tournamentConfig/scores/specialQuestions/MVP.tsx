import React from 'react';
import { Collapse } from '@mui/material';
import { SpecialQuestionConfigProps } from '../../types';
import MvpRules from '../../../takanon/specialQuestions/MvpRules';
import TakanonPreviewModal from '../../takanonPreview/TakanonPreviewModal';
import ScoreInput from '../ScoreInput';
import SpecialQuestionHeader from './SpecialQuestionHeader';
import MvpExplanation from './explanations/MvpExplanation';


const MVP_WINNING_STRING = 'זכייה בתואר';

function MVPConfig({disabled, ...formProps}: SpecialQuestionConfigProps){
	const { watch, register, errors, clearErrors, setValue } = formProps;
	const onChange = (event: any, value: boolean) => {
		setValue('specialQuestionFlags.mvp', value as never);
	}
	const isOn = watch('specialQuestionFlags.mvp');
	const scoreConfig = watch('specialBets.mvp');
	return (
		<div className='LigaBet-MVPConfig configContainer'>
			<SpecialQuestionHeader
				title={'שחקן מצטיין'}
				tooltipContent={<MvpExplanation />}
				switchProps={{
					checked: isOn,
					onChange: onChange,
				}}
			/>
			<Collapse in={isOn}>
				<div className='configRow'>
					<p className={'configLabel'}>
						{MVP_WINNING_STRING}
					</p>
					<ScoreInput
						error={errors.specialBets?.mvp?.message}
						InputProps={{
							...register('specialBets.mvp'),
							disabled,
						}}
						clearErrors={() => clearErrors('specialBets.mvp')}
					/>
				</div>
				<TakanonPreviewModal>
					<MvpRules score={scoreConfig} />
				</TakanonPreviewModal>
			</Collapse>
		</div>
	);
}


export default MVPConfig;