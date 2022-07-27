import React from 'react';
import Contestant from './ContestantProvider';


function LeaderboardView({
	rows,
}){
	return (<>
		<h1>טבלה עדכנית</h1>
		<div className="row" style={{margin: 0, padding: "5px 15px"}}>
			<div className="col-xs-2 pull-right col-no-padding" style={{textAlign: "center"}}>מיקום</div>
			<div className="col-xs-8 pull-right col-no-padding" style={{paddingRight: "7px"}}>שם</div>
			<div className="col-xs-2 pull-right col-no-padding" style={{paddingRight: "7px", textAlign: "center"}}>ניקוד</div>
		</div>
		{Object.values(rows).map((row)=>(
			<Contestant key={row.id} {...row}/>
		))}
	</>);
}



export default LeaderboardView;