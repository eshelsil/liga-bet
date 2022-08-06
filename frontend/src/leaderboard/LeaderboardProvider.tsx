import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ScoreboardRow } from '../types';
import { fetchAndStoreLeaderboard } from '../_actions/leaderboard'
import { LeaderboardSelector } from '../_selectors/leaderboard';
import LeaderboardView from './LeaderboardView';


interface Props {
	leaderboard: ScoreboardRow[],
	hasTournamentStarted: boolean,
	fetchAndStoreLeaderboard: () => void,
}


function Leaderboard({
	leaderboard,
	hasTournamentStarted,
	fetchAndStoreLeaderboard,
}: Props){
	
	useEffect(()=>{
		fetchAndStoreLeaderboard();
	}, [])

	return (<>
		{!hasTournamentStarted && (
			<h2>הטבלה תהיה זמינה ברגע שיתחיל המשחק הראשון בטורניר</h2>
		)}
		{hasTournamentStarted && (
			<LeaderboardView rows={leaderboard} />
		)}
	</>);
}



const mapDispatchToProps = {
    fetchAndStoreLeaderboard,
}


export default connect(LeaderboardSelector, mapDispatchToProps)(Leaderboard);