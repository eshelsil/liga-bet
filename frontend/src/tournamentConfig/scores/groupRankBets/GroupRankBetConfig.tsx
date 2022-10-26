import React from 'react';
import { useSelector } from 'react-redux';
import GroupRankExplanation from './GroupRankExplanation';
import GroupStageRules from '../../../takanon/groupStandings/GroupStageRulesProvider';
import TakanonPreviewModal from '../../takanonPreview/TakanonPreviewModal';
import { ScoreConfigFormProps } from '../../types';
import SectionTitle from '../SectionTitle';
import ScoreInput from '../ScoreInput';
import { CanUpdateScoreConfig } from '../../../_selectors';




const PERFECT_STRING = 'פגיעה מושלמת';
const MINOR_MISTAKE_STRING = 'טעות מינימלית';

function GroupRankBetConfig({
	register, clearErrors, errors, watch,
}: ScoreConfigFormProps){
	const disabled = !(useSelector(CanUpdateScoreConfig))
	const perfectScore = watch('groupRankBets.perfect') || 0;
	const minorMistakeScore = watch('groupRankBets.minorMistake') || 0;
	return (
		<div className='LigaBet-GroupRankBetConfig LB-ConfigBox'>
			<SectionTitle
				title={'ניקוד דירוגי בתים'}
				tooltipContent={<GroupRankExplanation />}
			/>
			<table className='LB-simpleTable'>
				<tbody>
					<tr>
						<td className={'configLabel'}>
							{PERFECT_STRING}
						</td>
						<td>
							<ScoreInput
								error={errors.groupRankBets?.perfect?.message}
								InputProps={{
									...register('groupRankBets.perfect'),
									disabled: disabled,
								}}
								clearErrors={() => clearErrors('groupRankBets.perfect')}
							/>
						</td>
					</tr>
					<tr>
						<td className={'configLabel'}>
							{MINOR_MISTAKE_STRING}
						</td>
						<td>
							<ScoreInput
								error={errors.groupRankBets?.minorMistake?.message}
								InputProps={{
									...register('groupRankBets.minorMistake'),
									disabled: disabled,
								}}
								clearErrors={() => clearErrors('groupRankBets.minorMistake')}
							/>
						</td>
					</tr>
				</tbody>
			</table>
			<TakanonPreviewModal>
				<GroupStageRules scoreConfig={{perfect:perfectScore, minorMistake: minorMistakeScore}}/>
			</TakanonPreviewModal>
		</div>
	);
}


export default GroupRankBetConfig;