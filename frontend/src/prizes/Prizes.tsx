import React from 'react';
import { usePrizesThemeClass } from '../hooks/useThemeClass';
import { prizeToString } from '../utils';


const rankToEmoji = {
	1: "🥇",
	2: "🥈",
	3: "🥉",
}

function PrizeBlock({
	prize,
	rank,
}: {
	prize: string,
	rank: number,
}){
	const getPrizeThemeClass = usePrizesThemeClass()

	return <div className={`LigaBet-Prize ${getPrizeThemeClass(rank)}`}>
		<p className='LB-Prize-text'>
			{prizeToString[rank]}{'  '}{rankToEmoji[rank] ?? ''}
			<br></br>
			{prize}
		</p>
	</div>
}

interface Props {
	prizes: string[],
}

function Prizes({ prizes }: Props){
	return (
		<div className='LB-PrizesView'>
			{prizes.map((prize, index) => (
				<PrizeBlock key={index} prize={prize} rank={index + 1} />
			))}
		</div>
	);
}

export default Prizes
