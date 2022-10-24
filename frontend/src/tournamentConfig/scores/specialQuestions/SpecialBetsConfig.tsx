import React from 'react';
import { useSelector } from 'react-redux';
import { CanUpdateScoreConfig } from '../../../_selectors';
import { ScoreConfigFormProps } from '../../types';
import SectionTitle from '../SectionTitle';
import MVPConfig from './MVP';
import OffensiveTeamConfig from './OffensiveTeam';
import RoadToFinalConfig from './RoadToFinalConfig';
import TopAssistsConfig from './TopAssists';
import TopScorerConfig from './TopScorer';



function SpecialBetsConfig(formProps: ScoreConfigFormProps){
	const disabled = !(useSelector(CanUpdateScoreConfig))
	return (
		<div className='LigaBet-SpecialBetsConfig'>
			<SectionTitle
				title={'ניקוד על שאלות מיוחדות'}
				tooltipContent={'explanation'}
			/>
			<RoadToFinalConfig disabled={disabled} {...formProps} />
			<TopScorerConfig disabled={disabled} {...formProps} />
			<TopAssistsConfig disabled={disabled} {...formProps} />
			<MVPConfig disabled={disabled} {...formProps} />
			<OffensiveTeamConfig disabled={disabled} {...formProps} />
		</div>
	);
}


export default SpecialBetsConfig;