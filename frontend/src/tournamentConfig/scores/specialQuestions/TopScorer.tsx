import React from 'react';
import { ScoreConfigFormProps } from '../../types';
import TopScorerRules from '../../../takanon/specialQuestions/TopScorerRules';
import TakanonPreviewModal from '../../takanonPreview/TakanonPreviewModal';
import ScoreInput from '../ScoreInput';
import SpecialQuestionHeader from './SpecialQuestionHeader';


const EACH_GOAL_STRING = 'כל גול';
const TOP_SCORER_WINNING_STRING = 'בונוס על זכייה בתואר';

function TopScorerConfig(formProps: ScoreConfigFormProps){
	const { watch, setValue, register, errors, clearErrors } = formProps;
	const onChange = (event: any, value: boolean) => {
		setValue('chosenSpecialQuestions.top_scorer', value as never);
	}
	const isOn = watch('chosenSpecialQuestions.top_scorer');
	const scoreConfig = watch('specialBets.top_scorer');
	return (
		<div className='LigaBet-TopScorerConfig configContainer'>
			<SpecialQuestionHeader
				title={'מלך שערים'}
				tooltipContent='any content'
				switchProps={{
					disabled: true,
					checked: isOn,
					onChange,
				}}
			/>
				<div className='configRow'>
					<p className={'configLabel'}>
						{EACH_GOAL_STRING}
					</p>
					<ScoreInput
						error={errors.specialBets?.top_scorer?.eachGoal?.message}
						InputProps={{
							...register('specialBets.top_scorer.eachGoal')
						}}
						clearErrors={() => clearErrors('specialBets.top_scorer.eachGoal')}
					/>
				</div>
				<div className='configRow'>
					<p className={'configLabel'}>
						{TOP_SCORER_WINNING_STRING}
					</p>
					<ScoreInput
						error={errors.specialBets?.top_scorer?.correct?.message}
						InputProps={{
							...register('specialBets.top_scorer.correct')
						}}
						clearErrors={() => clearErrors('specialBets.top_scorer.correct')}
					/>
				</div>
			<TakanonPreviewModal>
				<TopScorerRules scoreConfig={scoreConfig} />
			</TakanonPreviewModal>
		</div>
	);
}


export default TopScorerConfig;