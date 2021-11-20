import React, { useContext, useEffect, useState } from 'react';
import { TournamentContext } from '../contexts/tournament';
import { UserContext } from '../contexts/user';
import MatchResult from '../widgets/match_result';
import TeamWithFlag from '../widgets/team_with_flag';
import {sortBy} from "lodash";


function Leaderboard(props){
	const tournament = useContext(TournamentContext);
	if (!tournament.isStarted){
		return <h2>הטבלה תהיה זמינה ברגע שיתחיל המשחק הראשון בטורניר</h2>
	}

	const [rows, setRows] = useState({});
	const [matches, setMatches] = useState({});
	const [teams, setTeams] = useState({});
	const [groups, setGroups] = useState({});
	const [specialBetResults, setSpecialBets] = useState({});
	useEffect(()=>{
		//get data from API
		const gotFromAPI = {
			1: {
				rank: 1,
				rankDisplay: 1,
				change: 0,
				id: 1,
				name: "Eliyahu Hanavim",
				addedScore: 9,
				total_score: 27,
				relevantMatchBets: [
					{
						id: 3,
						bet: {
							home: 1,
							away: 1,
							ko_winner_side: 'away',
						},
						score: 3,
					}
				],
				groupRankBets:{
					"GROUP_A":{
						name: "Group A",
						id: "GROUP_A",
						isDone: true,
						score: 3,
						positions: {
							1: 10,
							2: 12,
							3: 9,
							4: 11,
						}
					}
				},
				specialBets:{
					1: {
						id: 1,
						score: null,
						bet: "haim"
					},
					2: {
						id: 2,
						score: 10,
						bet: 7,
					},
				}

			}
		}
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
		setRows(gotFromAPI);
		setMatches(gotFromAPI_matches);
		setTeams(gotFromAPI_teams);
		setGroups(gotFromAPI_groups);
		setSpecialBets(gotFromAPI_specialBets);
	}, [])

	function renderPosition(position, team_id){
		console.log('teams', teams)
		const team = teams[team_id];
		console.log('team', team, team_id)
		if (!team){
			return
		}
		return <div key={position} className="flex-row">
			<span>({position}) </span>
			<TeamWithFlag name={team.name} crest_url={team.crest_url}
			></TeamWithFlag>
		</div>
	}
	
	function renderRankChange(change){
		if (change > 0){
			return <bdi><span className="label label-success" style={{direction: "ltr"}} dir="RTL">+{change}</span></bdi>
		} else if (change < 0){
			return <bdi><span className="label label-danger" style={{direction: "ltr"}} dir="RTL">+{change}</span></bdi>
		}
		return null;
	}

	function formatSpecialBet(bet_data){

	}

	function renderSpecialBetScore(specialBet){
		const { id, score, bet } = specialBet;
		const specialBetResult = specialBetResults[id];
		const {name, isDone, answer} = specialBetResult;
		// TODO: format special bet answer
		if (!isDone){
			return;
		}
		return <li key={id} className="list-group-item row flex-row col-no-padding" style={{paddingRight: "10px"}}>
			<div className="col-xs-1 pull-right col-no-padding">{score}</div>
			<div className="col-xs-3 pull-right col-no-padding">{name}</div>
			<div className="col-xs-4 pull-right col-no-padding">{bet}</div>
			<div className="col-xs-4 pull-right col-no-padding">
				<div>{answer}</div>
			</div>
		</li>
	}

	function renderGroupRankScore(group){
		const {isDone, id, score, positions} = group;
		if (!isDone){
			return null;
		}
		return <li key={id} className="list-group-item row flex-row  col-no-padding">
			<div className="col-xs-2 pull-right col-no-padding" style={{paddingRight: "15px"}}>{score}</div>
			<div className="col-xs-5 pull-right col-no-padding">
				{Object.entries(positions).map(([position, team_id])=>{
					return renderPosition(position, team_id);
				})}
			</div>
			<div className="col-xs-5 pull-right col-no-padding">
				{Object.keys(positions).map((position)=>{
					const team_id = groups[id]['positions'][position];
					return renderPosition(position, team_id);
				})}
			</div>
		</li>
	}

	function renderMatchScore(match){
		const {id, score, bet} = match;
		const matchData = matches[id];
		if (!matchData){
			return null;
		}
		const {home_team, away_team} = matchData;
		return <li key={id} className="list-group-item row flex-row center-items col-no-padding" style={{paddingLeft: "0px", paddingRight: "10px"}}>
			<div className="col-xs-1 pull-right col-no-padding">{score}</div>
			<div className="col-xs-9 pull-right col-no-padding">
				<table>
					<tbody>
						<tr className="flex-row" style={{alignItems: "center"}}>
							<td className="flex-row dir-ltr">
								<TeamWithFlag name={home_team.name} crest_url={home_team.crest_url}
									is_underlined={bet.ko_winner_side === "home"}
									is_bold={match.winner_side === "home"}
								></TeamWithFlag>
								<span>({bet.home})</span>
							</td>
							<td style={{padding: "5px"}}>
								-
							</td>
							<td className="flex-row dir-ltr">
								<TeamWithFlag name={away_team.name} crest_url={away_team.crest_url}
									is_underlined={bet.ko_winner_side === "away"}
									is_bold={match.winner_side === "away"}
								></TeamWithFlag>
								<span>({bet.away})</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className="col-xs-2 pull-right col-no-padding"><MatchResult winner_class="bolded" matchData={matchData}/></div>
		</li>
	}
	function renderRow(row){
		const {rank, rankDisplay, change, id, name, addedScore, relevantMatchBets, groupRankBets, specialBets, total_score} = row;
		const matchesScore = relevantMatchBets.reduce((sum, match) => (sum + match.score) , 0);
		const groupRankScore = Object.values(groupRankBets).reduce((sum, group) => (sum + (group.score ?? 0)) , 0);
		const specialBetScore = Object.values(specialBets).reduce((sum, bet) => (sum + (bet.score ?? 0)) , 0);

		return <div key={id} className="panel-group" style={{marginBottom: 0}}>
			<div className="panel panel-default">
					<div className={`panel-heading row rank-${rank}`} style={{marginRight: 0, marginLeft: 0}}>
					<div className="col-xs-2 pull-right col-no-padding">
						<div className="col-xs-6 col-no-padding">{rankDisplay}</div>
						<div className="col-xs-6 col-no-padding" style={{marginRight: "-7px", marginLeft: "7px", marginTop: "-2px"}}>
							{renderRankChange(change)}
						</div>
					</div>
					<div className="col-xs-8 pull-right col-no-padding" style={{marginTop: "2px"}}>
						<h4 className="panel-title">
							<a data-toggle="collapse" href={`#collapserank-${id}`}><span className="admin">{id}</span>{name}</a>
						</h4>
					</div>
					<div className="col-xs-1 pull-right col-no-padding">
						{addedScore > 0 ? <bdi><span className="label label-success" style={{direction: "ltr"}} dir="RTL">+{addedScore}</span></bdi> : null}
					</div>
					<div className="col-xs-1 pull-right col-no-padding" style={{paddingRight: "7px"}}>{total_score}</div>
				</div>
				<div id={`collapserank-${id}`} className="panel-collapse collapse">
					<ul className="nav nav-tabs" style={{paddingRight: "0px"}}>
						<li className="active" style={{float: "right"}}><a data-toggle="tab" href={`#groups-${id}`}>משחקים</a></li>
						<li style={{float: "right"}}><a data-toggle="tab" href={`#group-ranks-${id}`}>מיקומי בתים</a></li>
						<li style={{float: "right"}}><a data-toggle="tab" href={`#special-bets-${id}`}>הימורים מיוחדים</a></li>
					</ul>

					<div className="tab-content">
						<div id={`groups-${id}`} className="tab-pane fade in active" style={{padding: "20px"}}>
							<h3>סה"כ: {matchesScore}</h3>
							<ul className="list-group" style={{paddingRight: "0px"}}>
								<li className="list-group-item row " style={{background: "#d2d2d2", paddingRight: "10px"}}>
									<div className="col-xs-1 pull-right col-no-padding">נק'</div>
									<div className="col-xs-9 pull-right col-no-padding">הימור</div>
									<div className="col-xs-2 pull-right col-no-padding">תוצאה</div>
								</li>
								{sortBy(relevantMatchBets, "id").map(renderMatchScore)}
							</ul>
						</div>
						<div id={`group-ranks-${id}`} className="tab-pane fade" style={{padding: "20px"}}>
							<h3>סה"כ: {groupRankScore}</h3>
							<ul className="list-group" style={{paddingRight: "0px"}}>
								<li className="list-group-item row" style={{background: "#d2d2d2"}}>
									<div className="col-xs-2 pull-right col-no-padding">ניקוד</div>
									<div className="col-xs-5 pull-right col-no-padding">הימור</div>
									<div className="col-xs-5 pull-right col-no-padding">תוצאה</div>
								</li>
								{sortBy(Object.values(groupRankBets), 'id').map(renderGroupRankScore)}
							</ul>
						</div>
						<div id={`special-bets-${id}`} className="tab-pane fade" style={{padding: "20px"}}>
							<h3>סה"כ: {specialBetScore}</h3>
							<ul className="list-group" style={{paddingRight: "0px"}}>
								<li className="list-group-item row" style={{background: "#d2d2d2", paddingRight: "10px"}}>
									<div className="col-xs-1 pull-right col-no-padding">נק'</div>
									<div className="col-xs-3 pull-right col-no-padding">סוג</div>
									<div className="col-xs-4 pull-right col-no-padding">הימור</div>
									<div className="col-xs-4 pull-right col-no-padding">תוצאה</div>
								</li>
								{sortBy(Object.values(specialBets), 'id').map(renderSpecialBetScore)}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	}
	return <React.Fragment>
		<h1>טבלה עדכנית</h1>
		<div className="row" style={{margin: 0, padding: "5px 15px"}}>
			<div className="col-xs-2 pull-right col-no-padding" style={{textAlign: "center"}}>מיקום</div>
			<div className="col-xs-8 pull-right col-no-padding" style={{paddingRight: "7px"}}>שם</div>
			<div className="col-xs-2 pull-right col-no-padding" style={{paddingRight: "7px", textAlign: "center"}}>ניקוד</div>
		</div>
		{Object.values(rows).map(renderRow)}
	</React.Fragment>
}

export default Leaderboard;