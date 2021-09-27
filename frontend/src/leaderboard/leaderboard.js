import React, { useContext, useEffect, useState } from 'react';
import { TournamentContext } from '../tournament/tournament';
import { UserContext } from '../user/user';
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
						score: 6,
						positions: {
							1: 10,
							2: 12,
							3: 9,
							4: 11,
						}
					}
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
		setRows(gotFromAPI);
		setMatches(gotFromAPI_matches);
	}, [])

	function renderRankChange(change){
		if (change > 0){
			return <bdi><span className="label label-success" style={{direction: "ltr"}} dir="RTL">+{change}</span></bdi>
		} else if (change < 0){
			return <bdi><span className="label label-danger" style={{direction: "ltr"}} dir="RTL">+{change}</span></bdi>
		}
		return null;
	}
	function renderGroupRankScore(group){
		const {isDone, score, positions} = group;
		if (!isDone){
			return null;
		}
		return <li className="list-group-item row flex-row  col-no-padding">
			<div className="col-xs-2 pull-right col-no-padding" style={{paddingRight: "15px"}}>{score}</div>
			<div className="col-xs-5 pull-right col-no-padding">
			@foreach($positions as $position)
			@php
				$bet_team_id = $bet->getData($position);
				$bet_team = $teamsById[$bet_team_id];
			@endphp
			
				<div className="flex-row">
					<span>({{$position}}) </span>
					@include('widgets.teamWithFlag', $bet_team)
				</div>
			@endforeach
		</div>
		<div className="col-xs-5 pull-right col-no-padding">
			@foreach($positions as $position)
			@php
				$res_team_id = $group->getTeamIDByPosition($position);
				$res_team = $teamsById[$res_team_id];
			@endphp
				<div className="flex-row">
					<span>({{$position}}) </span>
					@include('widgets.teamWithFlag', $res_team)
				</div>
			@endforeach
		</div>
	</li>
		const matchData = matches[id];
		if (!matchData){
			return null;
		}
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
		const {rank, rankDisplay, change, id, name, addedScore, relevantMatchBets, groupRankBets, total_score} = row;
		const matchesScore = relevantMatchBets.reduce((sum, match) => (sum + match.score) , 0);
		const groupRankScore = groupRankBets.reduce((sum, group) => (sum + (group.score ?? 0)) , 0);

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
						<div id={`group-ranks-${id}`} className="tab-pane fade" style={padding: "20px"}>
							<h3>סה"כ: {groupRankScore}</h3>
							<ul className="list-group" style={{paddingRight: "0px"}}>
								<li className="list-group-item row" style={{background: "#d2d2d2"}}>
									<div className="col-xs-2 pull-right col-no-padding">ניקוד</div>
									<div className="col-xs-5 pull-right col-no-padding">הימור</div>
									<div className="col-xs-5 pull-right col-no-padding">תוצאה</div>
								</li>
								{sortBy(Object.values(groupRankBets), 'id').map(renderGroupRankScore)}
								@foreach($groupRankBets->sortBy("type_id") as $bet)
								<?php
										$group = App\Group::find($bet->type_id);
								?>
								@if ($group->isComplete())
									<?php
										$positions = range(1,4);
										$teamsById = $group->getGroupTeamsById();
									?>
									
								@endif
							@endforeach
							</ul>
						</div>
						{/* <div id="special-bets-{{$row->id}}" className="tab-pane fade" style="padding: 20px;">
							@php
								$betType = \App\Enums\BetTypes::SpecialBet;
								$specialBets = $row->betsByType->has($betType)  ? $row->betsByType[$betType] : collect();
							@endphp
							<h3>סה"כ: {{ $specialBets->sum("score") }}</h3>
							<ul className="list-group" style="padding-right: 0px;">
								<li className="list-group-item row" style="background: #d2d2d2; padding-right: 10px;">
									<div className="col-xs-1 pull-right col-no-padding">נק'</div>
									<div className="col-xs-3 pull-right col-no-padding">סוג</div>
									<div className="col-xs-4 pull-right col-no-padding">הימור</div>
									<div className="col-xs-4 pull-right col-no-padding">תוצאה</div>
								</li>
							@foreach($specialBets->sortBy("type_id") as $bet)
								<?php
								$specialBet = \App\SpecialBets\SpecialBet::find($bet->type_id);
								$betDescription = $specialBet->formatDescription($bet->getData("answer"));
								$answer = $specialBet->getAnswer();
								$resultDescription = $specialBet->formatDescription($answer);
								?>
								<li className="list-group-item row flex-row col-no-padding" style="padding-right: 10px;">
									<div className="col-xs-1 pull-right col-no-padding">{{ $bet->score }}</div>
									<div className="col-xs-3 pull-right col-no-padding">{{ $specialBet->getTitle() }}</div>
									<div className="col-xs-4 pull-right col-no-padding">{!! $betDescription !!}</div>
									<div className="col-xs-4 pull-right col-no-padding">
										<div>{!! $resultDescription !!}</div>
									</div>
								</li>
							@endforeach
							</ul>
						</div> */}
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
	// return (
	// 	<h1>Leaderboard table</h1>
	// );
}

export default Leaderboard;