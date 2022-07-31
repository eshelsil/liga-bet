import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useTournamentContext } from '../contexts/tournament';
import { fetchAndStoreLeaderboard } from '../_actions/leaderboard.ts'
import { LeaderboardSelector } from '../_selectors/leaderboard.ts';
import LeaderboardView from './LeaderboardView';




function Leaderboard({
	leaderboard,
	fetchAndStoreLeaderboard,
}){
	const tournament = useTournamentContext();
	const {isStarted: isTournamentStarted} = tournament;
	
	useEffect(()=>{
		fetchAndStoreLeaderboard();
	}, [])

	return (<>
		{!isTournamentStarted && (
			<h2>הטבלה תהיה זמינה ברגע שיתחיל המשחק הראשון בטורניר</h2>
		)}
		{isTournamentStarted && (
			<LeaderboardView rows={leaderboard} />
		)}
	</>);
}



const mapDispatchToProps = {
    fetchAndStoreLeaderboard,
}


export default connect(LeaderboardSelector, mapDispatchToProps)(Leaderboard);