import React from 'react';
import { ScoreConfigFormProps, SpecialQuestionConfigProps } from '../../types';
import TopScorerRules from '../../../takanon/specialQuestions/TopScorerRules';
import TakanonPreviewModal from '../../takanonPreview/TakanonPreviewModal';
import ScoreInput from '../ScoreInput';
import SpecialQuestionHeader from './SpecialQuestionHeader';
import TopScorerExplanation from './explanations/TopScorerExplanation';


const EACH_GOAL_STRING = 'ניקוד על כל גול';
const TOP_SCORER_WINNING_STRING = 'בונוס על זכייה בתואר';

function TopScorerConfig({disabled, ...formProps}: SpecialQuestionConfigProps){
	const { watch, setValue, register, errors, clearErrors } = formProps;
	const onChange = (event: any, value: boolean) => {
		setValue('specialQuestionFlags.topScorer', value as never);
	}
	const isOn = watch('specialQuestionFlags.topScorer');
	const scoreConfig = watch('specialBets.topScorer');
	return (
		<div className='LigaBet-TopScorerConfig configContainer'>
			<SpecialQuestionHeader
				title={'מלך שערים'}
				tooltipContent={<TopScorerExplanation />}
				switchProps={{
					disabled: true,
					checked: isOn,
					onChange,
				}}
			/>
				<table className='LB-simpleTable'>
					<tbody>
						<tr>
							<td className={'configLabel'}>
								{EACH_GOAL_STRING}
							</td>
							<td>
								<ScoreInput
									error={errors.specialBets?.topScorer?.eachGoal?.message}
									InputProps={{
										...register('specialBets.topScorer.eachGoal'),
										disabled,
									}}
									clearErrors={() => clearErrors('specialBets.topScorer.eachGoal')}
								/>
							</td>
						</tr>
						<tr>
							<td className={'configLabel'}>
								{TOP_SCORER_WINNING_STRING}
							</td>
							<td>
								<ScoreInput
									error={errors.specialBets?.topScorer?.correct?.message}
									InputProps={{
										...register('specialBets.topScorer.correct'),
										disabled,
									}}
									clearErrors={() => clearErrors('specialBets.topScorer.correct')}
								/>
							</td>
						</tr>
					</tbody>
				</table>
			<TakanonPreviewModal>
				<TopScorerRules scoreConfig={scoreConfig} />
			</TakanonPreviewModal>
		</div>
	);
}


export default TopScorerConfig;