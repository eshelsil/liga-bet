import React from 'react';


function getAxes(max: number): number[]{
	if (max <= 50){
		return [25, 50]
	}
	const digitsCount = `${max}`.length
	let jump: number;
	let axesCount: number;
	const first2Digits = Number(`${max}`.slice(0,2))
	if (first2Digits < 20){
		jump = 10 ** (digitsCount - 2) * 5
		axesCount = 4
	} else if (first2Digits < 50){
		jump = 10 ** (digitsCount - 2) * 10
		axesCount = 5
	} else {
		jump = 10 ** (digitsCount - 2) * 25
		axesCount = 4
	}
	const axis = []
	for (let i = 1; i <= axesCount; i++){
		axis.push(jump * i)
	}
	return axis
}


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