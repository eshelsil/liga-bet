import React from 'react';
import { useTranslation } from 'react-i18next';
import { Collapse } from '@mui/material';
import { SpecialQuestionConfigProps } from '../../types';
import MvpRules from '../../../takanon/specialQuestions/MvpRules';
import TakanonPreviewModal from '../../takanonPreview/TakanonPreviewModal';
import ScoreInput from '../ScoreInput';
import SpecialQuestionHeader from './SpecialQuestionHeader';
import MvpExplanation from './explanations/MvpExplanation';


function MVPConfig({disabled, ...formProps}: SpecialQuestionConfigProps){
	const { t } = useTranslation('tournamentConfig')
	const { watch, register, errors, clearErrors, setValue } = formProps;
	const onChange = (event: any, value: boolean) => {
		setValue('specialQuestionFlags.mvp', value as never);
	}
	const isOn = watch('specialQuestionFlags.mvp');
	const scoreConfig = watch('specialBets.mvp');
	return (
		<div className='LigaBet-MVPConfig configContainer'>
			<SpecialQuestionHeader
				title={t('mvp.title')}
				tooltipContent={<MvpExplanation />}
				switchProps={{
					checked: isOn,
					onChange: onChange,
				}}
			/>
			<Collapse in={isOn}>
				<div className='configRow'>
					<p className={'configLabel'}>
						{t('mvp.winning')}
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