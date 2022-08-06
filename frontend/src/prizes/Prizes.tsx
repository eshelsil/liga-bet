import React from 'react';


const fakePrizes: Record<number, Prize> = {
	1: {
		id: 1,
		label: "מקום ראשון",
		amount: "1800 ₪",
	},
	2: {
		id: 2,
		label: "מקום שני",
		amount: "800 ₪",
	},
	3: {
		id: 3,
		label: "מקום שלישי",
		amount: "400 ₪",
	},
	4: {
		id: 4,
		label: "מקום רביעי",
		amount: "200 ₪",
	},
};

interface Prize {
	label: string,
	amount: string,
	id: number,
}

function PrizeBlock({
	prize: {
		label,
		amount,
		id,
	},
}: {
	prize: Prize,
}){
	return <div className={`well rank-${id}`}>
		<p>{label}<br></br>{amount}</p>
	</div>
}

function Prizes(){
	
	return (<>
		{Object.values(fakePrizes).map(prize => (
			<PrizeBlock key={prize.id} prize={prize} />
		))}
	</>);
}

export default Prizes;