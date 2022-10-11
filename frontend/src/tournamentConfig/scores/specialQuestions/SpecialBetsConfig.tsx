import React from 'react';
import { ScoreConfigFormProps } from '../../types';
import SectionTitle from '../SectionTitle';
import MVPConfig from './MVP';
import OffensiveTeamConfig from './OffensiveTeam';
import RoadToFinalConfig from './RoadToFinalConfig';
import TopAssistsConfig from './TopAssists';
import TopScorerConfig from './TopScorer';



function SpecialBetsConfig(formProps: ScoreConfigFormProps){
	return (
		<div className='LigaBet-SpecialBetsConfig'>
			<SectionTitle
				title={'ניקוד על שאלות מיוחדרות'}
				tooltipContent={'explanation'}
			/>
			<RoadToFinalConfig {...formProps} />
			<TopScorerConfig {...formProps} />
			<TopAssistsConfig {...formProps} />
			<MVPConfig {...formProps} />
			<OffensiveTeamConfig {...formProps} />
		</div>
	);
}


export default SpecialBetsConfig;