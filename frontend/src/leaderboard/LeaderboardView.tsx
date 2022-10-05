import React from 'react';
import { ScoreboardRow, ScoreboardRowDetailed } from '../types';
import { Dictionary } from 'lodash';
import Contestant from './ContestantProvider';
import './Leaderboard.scss';


function getRankDisplayById(rows: ScoreboardRow[]){
	const rankDisplayById = {} as Dictionary<string>;
	let lastRank = 0;
	for (const row of rows){
		const { rank, id } = row;
		if (lastRank === row.rank){
			rankDisplayById[id] = '-';
		} else {
			lastRank = rank;
			rankDisplayById[id] = `${rank}`;
		}
	}
	return rankDisplayById
}

interface Props {
	rows: ScoreboardRowDetailed[],
}

function LeaderboardView({
	rows,
}: Props){
	const rankDisplayById = getRankDisplayById(rows);
	return (
		<div className="LigaBet-LeaderboardView">
			<h1>טבלה עדכנית</h1>
			<div className="row" style={{margin: 0, padding: "5px 15px"}}>
				<div className="col-xs-2 pull-right col-no-padding" style={{textAlign: "center"}}>מיקום</div>
				<div className="col-xs-8 pull-right col-no-padding" style={{paddingRight: "7px"}}>שם</div>
				<div className="col-xs-2 pull-right col-no-padding" style={{paddingRight: "7px", textAlign: "center"}}>ניקוד</div>
			</div>
			{Object.values(rows).map((row)=>(
				<Contestant key={row.id} scoreboardRow={row} rankDisplay={rankDisplayById[row.id]} />
			))}
		</div>
	);
}



export default LeaderboardView;