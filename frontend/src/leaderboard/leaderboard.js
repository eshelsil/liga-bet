import React, { useEffect } from 'react';
import { useTournamentContext } from '../contexts/tournament';
import Contestant from './contestant';
import { fetch_leaderboard } from '../_actions/leaderboard'
import { LeaderboardSelector } from '../_selectors/main';
import { connect } from 'react-redux';




function Leaderboard({
	leaderboard,
	fetch_leaderboard,
}){
	const tournament = useTournamentContext();
	if (!tournament.isStarted){
		return <h2>הטבלה תהיה זמינה ברגע שיתחיל המשחק הראשון בטורניר</h2>
	}
	
	const rows = leaderboard;
	
	useEffect(()=>{
		fetch_leaderboard();
	}, [])

	return <React.Fragment>
		<h1>טבלה עדכנית</h1>
		<div className="row" style={{margin: 0, padding: "5px 15px"}}>
			<div className="col-xs-2 pull-right col-no-padding" style={{textAlign: "center"}}>מיקום</div>
			<div className="col-xs-8 pull-right col-no-padding" style={{paddingRight: "7px"}}>שם</div>
			<div className="col-xs-2 pull-right col-no-padding" style={{paddingRight: "7px", textAlign: "center"}}>ניקוד</div>
		</div>
		{Object.values(rows).map((row)=>(
			<Contestant key={row.id} {...row}/>
		))}
	</React.Fragment>
}



const mapDispatchToProps = {
    fetch_leaderboard,
}


export default connect(LeaderboardSelector, mapDispatchToProps)(Leaderboard);