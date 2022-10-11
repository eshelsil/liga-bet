import React from 'react';
import GroupRankExplanation from './GroupRankExplanation';
import GroupStageRules from '../../../takanon/groupStandings/GroupStageRulesProvider';
import TakanonPreviewModal from '../../takanonPreview/TakanonPreviewModal';
import { ScoreConfigFormProps } from '../../types';
import SectionTitle from '../SectionTitle';
import ScoreInput from '../ScoreInput';




const PERFECT_STRING = 'פגיעה מושלמת';
const MINOR_MISTAKE_STRING = 'טעות מינימלית';

function GroupRankBetConfig({
	register, clearErrors, errors, watch,
}: ScoreConfigFormProps){
	const perfectScore = watch('groupRankBets.perfect') || 0;
	const minorMistakeScore = watch('groupRankBets.minorMistake') || 0;
	return (
		<div className='LigaBet-GroupRankBetConfig'>
			<SectionTitle
				title={'ניקוד דירוגי בתים'}
				tooltipContent={<GroupRankExplanation />}
			/>
			<div className='configRow'>
				<p className={'configLabel'}>
					{PERFECT_STRING}
				</p>
				<ScoreInput
					error={errors.groupRankBets?.perfect?.message}
					InputProps={{
						...register('groupRankBets.perfect')
					}}
					clearErrors={() => clearErrors('groupRankBets.perfect')}
				/>

			</div>
			<div className='configRow'>
				<p className={'configLabel'}>
					{MINOR_MISTAKE_STRING}
				</p>
				<ScoreInput
					error={errors.groupRankBets?.minorMistake?.message}
					InputProps={{
						...register('groupRankBets.minorMistake')
					}}
					clearErrors={() => clearErrors('groupRankBets.minorMistake')}
				/>
			</div>
			<TakanonPreviewModal>
				<GroupStageRules scoreConfig={{perfect:perfectScore, minorMistake: minorMistakeScore}}/>
			</TakanonPreviewModal>
		</div>
	);
}


export default GroupRankBetConfig;