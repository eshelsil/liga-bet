import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScoreConfigFormProps, SpecialQuestionConfigProps } from '../../types';
import TopScorerRules from '../../../takanon/specialQuestions/TopScorerRules';
import TakanonPreviewModal from '../../takanonPreview/TakanonPreviewModal';
import ScoreInput from '../ScoreInput';
import SpecialQuestionHeader from './SpecialQuestionHeader';
import TopScorerExplanation from './explanations/TopScorerExplanation';


function TopScorerConfig({disabled, ...formProps}: SpecialQuestionConfigProps){
	const { t } = useTranslation('tournamentConfig')
	const { watch, setValue, register, errors, clearErrors } = formProps;
	const onChange = (event: any, value: boolean) => {
		setValue('specialQuestionFlags.topScorer', value as never);
	}
	const isOn = watch('specialQuestionFlags.topScorer');
	const scoreConfig = watch('specialBets.topScorer');
	return (
		<div className='LigaBet-TopScorerConfig configContainer'>
			<SpecialQuestionHeader
				title={t('topScorer.title')}
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
								{t('topScorer.eachGoal')}
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
								{t('topScorer.winning')}
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