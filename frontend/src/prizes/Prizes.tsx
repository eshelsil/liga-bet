import React from 'react';
import { prizeToString } from '../utils';


function PrizeBlock({
	prize,
	rank,
}: {
	prize: string,
	rank: number,
}){
	return <div className={`LigaBet-Prize prize_rank_${rank}`}>
		<p>{prizeToString[rank]}<br></br>{prize}</p>
	</div>
}

interface Props {
	prizes: string[],
}

function Prizes({ prizes }: Props){
	return (<>
		{prizes.map((prize, index) => (
			<PrizeBlock key={index} prize={prize} rank={index + 1} />
		))}
	</>);
}

export default Prizes
