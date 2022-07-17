import React, { useContext, useEffect, useState } from 'react';
import { useTournamentContext } from '../contexts/tournament';
import { UserContext } from '../contexts/user';
import MatchResult from '../widgets/match_result';
import TeamWithFlag from '../widgets/team_with_flag';
import {sortBy} from "lodash";
import { useLeaderboardContext } from '../contexts/leaderboard';
import Contestant from './contestant';
import { fetch_leaderboard } from '../_actions/leaderboard'
import { LeaderboardSelector } from '../_selectors/main';
import { connect } from 'react-redux';
import { createSingleton } from '../_actions/utils';




function Leaderboard(props){
	const tournament = useTournamentContext();
	// const leaderboardContext = useLeaderboardContext();
	if (!tournament.isStarted){
		return <h2>הטבלה תהיה זמינה ברגע שיתחיל המשחק הראשון בטורניר</h2>
	}
	
	// const [rows, setRows] = useState({});
	// const { rows } = leaderboardContext;
	const [matches, setMatches] = useState({});
	const [teams, setTeams] = useState({});
	const [groups, setGroups] = useState({});
	const [specialBetResults, setSpecialBets] = useState({});
	const {leaderboard, fetch_leaderboard} = props;
	const rows = leaderboard;
	
	useEffect(()=>{
		fetch_leaderboard();
		//get data from API
		// leaderboardContext.initialize();
		// const gotFromAPI = leaderboardContext.leaderboard
		// const gotFromAPI = {
		// 	1: {
		// 		rank: 1,
		// 		ranFkDisplay: 1,
		// 		change: 0,
		// 		id: 1,
		// 		name: "Eliyahu Hanavim",
		// 		addedScore: 9,
		// 		total_score: 27,
		// 		relevantMatchBets: [
		// 			{
		// 				id: 3,
		// 				bet: {
		// 					home: 1,
		// 					away: 1,
		// 					ko_winner_side: 'away',
		// 				},
		// 				score: 3,
		// 			}
		// 		],
		// 		groupRankBets:{
		// 			"GROUP_A":{
		// 				name: "Group A",
		// 				id: "GROUP_A",
		// 				isDone: true,
		// 				score: 3,
		// 				positions: {
		// 					1: 10,
		// 					2: 12,
		// 					3: 9,
		// 					4: 11,
		// 				}
		// 			}
		// 		},
		// 		specialBets:{
		// 			1: {
		// 				id: 1,
		// 				score: null,
		// 				bet: "haim"
		// 			},
		// 			2: {
		// 				id: 2,
		// 				score: 10,
		// 				bet: 7,
		// 			},
		// 		}

		// 	}
		// }
		const gotFromAPI_matches = {
			3: {
				home_team: {
					name: "Israel",
					id: 4,
					crest_url: "https://localhost/1111"
				},
				away_team: {
					name: "Austria",
					id: 14,
					crest_url: "https://localhost/1111"
				},
				result_home: 5,
				result_away: 2,
				winner_side: 'home',
				id: 3,
			}
		}
		const gotFromAPI_teams = {
			10: {
				name: "Belgium",
				id: 10,
				crest_url: "https://localhost/1111"
			},
			9: {
				name: "Denemark",
				id: 9,
				crest_url: "https://localhost/1111"
			},
			11: {
				name: "Russia",
				id: 11,
				crest_url: "https://localhost/1111"
			},
			12: {
				name: "Finland",
				id: 12,
				crest_url: "https://localhost/1111"
			}
		}
		const gotFromAPI_groups = {
			"GROUP_A": {
				name: "Group A",
				id: "GROUP_A",
				isDone: true,
				positions: {
					1: 12,
					2: 10,
					3: 9,
					4: 11,
				}
			}
		}
		const gotFromAPI_specialBets = {
			1: {
				name: "Top Scorer",
				key: "top_scorer",
				id: 1,
				isDone: false,
			},
			2: {
				name: "Most offensive team",
				key: "most_offensive_team",
				id: 2,
				isDone: true,
				answer: 7,
			},
		}
		// setRows(gotFromAPI);
		setMatches(gotFromAPI_matches);
		setTeams(gotFromAPI_teams);
		setGroups(gotFromAPI_groups);
		setSpecialBets(gotFromAPI_specialBets);
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