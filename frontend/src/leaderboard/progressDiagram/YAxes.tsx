import React from 'react';
import { getAxes } from './utils';



interface YAxesProps {
	maxScore: number,
}

function YAxes ({ maxScore }: YAxesProps) {
	const axes = getAxes(maxScore)

  	return (
		<>
			{axes.map(x => (
				<div key={x} className='LB-YAxes' style={{left: `${x / maxScore * 100}%`}}>
					<span>{x}</span>
				</div>
			))}
		</>
	);
};

export default YAxes;