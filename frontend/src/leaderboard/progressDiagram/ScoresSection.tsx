import React from 'react';
import { ScoreboardRowDetailed } from '../../types';
import { keysOf } from '../../utils';
import YAxes from './YAxes';
import ScoresBar from './ScoresBar';
import { Dictionary } from '@reduxjs/toolkit';




interface Props {
	maxScore: number
	rowByUtlId: Dictionary<ScoreboardRowDetailed>,
	heightByUtlId: Record<number, number>,
	userColors: Record<number, string>,
	showChange: boolean,
}


function ProgressDiagramScoresSection ({ maxScore, rowByUtlId, userColors, heightByUtlId, showChange }: Props) {
	const utlIds = keysOf(rowByUtlId)
	
  	return (
		<div className='LB-ProgressDiagramScoresSection'>
			<div className='ProgressDiagramScoresSection-content'>
				<YAxes maxScore={maxScore}/>
				{utlIds.map(
					utlId => (
						!!rowByUtlId[utlId] ? (
							<ScoresBar
								key={utlId}
								row={rowByUtlId[utlId]}
								userColor={userColors[utlId]}
								top={heightByUtlId[utlId]}
								showChange={showChange}
								maxScore={maxScore}
							/>
						) : null
					)
				)}
			</div>
		</div>
  	);
};

export default ProgressDiagramScoresSection;

