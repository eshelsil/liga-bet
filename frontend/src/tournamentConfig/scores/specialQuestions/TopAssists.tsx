import React from 'react';
import { Collapse } from '@mui/material';
import { SpecialQuestionConfigProps } from '../../types';
import TakanonPreviewModal from '../../takanonPreview/TakanonPreviewModal';
import MostAssistsRules from '../../../takanon/specialQuestions/MostAssistsRules';
import ScoreInput from '../ScoreInput';
import SpecialQuestionHeader from './SpecialQuestionHeader';
import TopAssistsExplanation from './explanations/TopAssistsExplanation';


const TOP_ASSISTS_WINNING_STRING = 'בונוס על זכייה בתואר';
const TOP_ASSISTS_EACH_STRING = 'כל בישול';

function TopAssistsConfig({disabled, ...formProps}: SpecialQuestionConfigProps){
	const { watch, register, errors, clearErrors, setValue } = formProps;
	const onChange = (event: any, value: boolean) => {
		setValue('specialQuestionFlags.topAssists', value as never);
	}
	const isOn = watch('specialQuestionFlags.topAssists');
	const scoreConfig = watch('specialBets.topAssists');

	const topAssistsErrors = errors.specialBets?.topAssists
	return (
		<div className='LigaBet-TopAssists configContainer'>
			<SpecialQuestionHeader
				title={'מלך בישולים'}
				tooltipContent={<TopAssistsExplanation />}
				switchProps={{
					checked: isOn,
					onChange: onChange,
				}}
			/>
			<Collapse in={isOn}>
				<table className='LB-simpleTable'>
					<tbody>
						<tr>
							<td className={'configLabel'}>
								{TOP_ASSISTS_EACH_STRING}
							</td>
							<td>
								<ScoreInput
									error={topAssistsErrors?.eachGoal?.message}
									InputProps={{
										...register('specialBets.topAssists.eachGoal'),
										disabled,
									}}
									clearErrors={() => clearErrors('specialBets.topAssists.eachGoal')}
								/>
							</td>
						</tr>
						<tr>
							<td className={'configLabel'}>
								{TOP_ASSISTS_WINNING_STRING}
							</td>
							<td>
								<ScoreInput
									error={topAssistsErrors?.correct?.message}
									InputProps={{
										...register('specialBets.topAssists.correct'),
										disabled,
									}}
									clearErrors={() => clearErrors('specialBets.topAssists.correct')}
								/>
							</td>
						</tr>
					</tbody>
				</table>
				<TakanonPreviewModal>
					<MostAssistsRules scoreConfig={scoreConfig} />
				</TakanonPreviewModal>
			</Collapse>
		</div>
	);
}


export default TopAssistsConfig;