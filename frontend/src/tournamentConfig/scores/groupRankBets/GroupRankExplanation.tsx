import React from 'react';
import { GroupRankBetScoreConfig } from '../../../types';
import GroupStageRules from '../../../takanon/groupStandings/GroupStageRulesProvider';


function GroupRankExplanation(){
    const exampleScoreConfig: GroupRankBetScoreConfig = {
        minorMistake: 3,
        perfect: 6,
    };
	return (
		<div className='LigaBet-GroupRankBetConfig'>
            <GroupStageRules scoreConfig={exampleScoreConfig} />
		</div>
	);
}


export default GroupRankExplanation;