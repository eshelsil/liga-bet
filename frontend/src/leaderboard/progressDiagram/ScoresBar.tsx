import React from 'react';
import { ScoreboardRowDetailed } from '../../types';



interface ScoresBarProps {
	row: ScoreboardRowDetailed,
	top: number,
	maxScore: number,
	userColor: string,
	showChange: boolean,
}


function ScoresBar({ row, top, maxScore, userColor, showChange }: ScoresBarProps) {
	const changeString = (row.addedScore < 0) ? `${Math.abs(row.addedScore)} -` : `${row.addedScore} +`
	return (
		<div className={'LB-ScoresBar'} style={{top}}>
			<div
				className={'ScoresBar-bar'}
				style={{
					width: `${(row.score / maxScore) * 100}%`,
					backgroundColor: userColor
				}}
			>
				<div className={'ScoresBar-addedScore'}>
					{showChange && row.addedScore != 0 ? changeString : ''}
				</div>
				<div className={'ScoresBar-scores'} style={{ color: userColor }}>
					{row.score}
				</div>
			</div>
		</div>
	)
};

export default ScoresBar;

