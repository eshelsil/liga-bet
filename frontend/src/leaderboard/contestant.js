import React, { useEffect } from "react";
import { sortBy } from "lodash";
import { useMatchesContext } from "../contexts/matches";
import { fetch_matches } from '../_actions/matches'
import { useGroupsContext } from "../contexts/groups";
import { useSpecialQuestionsContext } from "../contexts/specialQuestions";
import { useBetsContext } from "../contexts/bets";
import { connect } from "react-redux";
import { fetch_bets } from "../_actions/bets";
import { fetch_teams } from "../_actions/teams";
import { ContestantSelector } from "../_selectors/main";
import { BetTypes } from "../_enums/betTypes";
import TeamWithFlag from '../widgets/team_with_flag';
import MatchResult from "../widgets/match_result";



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

function renderMatchScore(bet){
    const {id, score, result_home, result_away, winner_side, relatedMatch} = bet;
    if (!relatedMatch){
        return null;
    }
    const {home_team, away_team} = relatedMatch;
    return <li key={id} className="list-group-item row flex-row center-items col-no-padding" style={{paddingLeft: "0px", paddingRight: "10px"}}>
        <div className="col-xs-1 pull-right col-no-padding">{score}</div>
        <div className="col-xs-9 pull-right col-no-padding">
            <table>
                <tbody>
                    <tr className="flex-row" style={{alignItems: "center"}}>
                        <td className="flex-row dir-ltr">
                            <TeamWithFlag name={home_team.name} crest_url={home_team.crest_url}
                                is_underlined={winner_side === "home"}
                                is_bold={relatedMatch.winner_side === "home"}
                            ></TeamWithFlag>
                            <span>({result_home})</span>
                        </td>
                        <td style={{padding: "5px"}}>
                            -
                        </td>
                        <td className="flex-row dir-ltr">
                            <TeamWithFlag name={away_team.name} crest_url={away_team.crest_url}
                                is_underlined={winner_side === "away"}
                                is_bold={relatedMatch.winner_side === "away"}
                            ></TeamWithFlag>
                            <span>({result_away})</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div className="col-xs-2 pull-right col-no-padding"><MatchResult winner_class="bolded" matchData={relatedMatch}/></div>
    </li>
}

export function Contestant(props){
    const {rank, rankDisplay, change, id, user_id, name, addedScore, relevantMatchBets, groupRankBets, specialBets, total_score} = props;
    // const matchesContext = useMatchesContext();
    const {fetch_matches, fetch_bets, fetch_teams, contestantBetsData} = props;

    const userBetsByType = contestantBetsData[user_id] ?? {};
    const userMatchBets = userBetsByType[BetTypes.Match] ?? [];



    const groupsContext = useGroupsContext();
    const specialQuestionsContext = useSpecialQuestionsContext();
    const betsContext = useBetsContext();
    // const { matches } = matchesContext ?? {};
    const { groups } = groupsContext ?? {};
    const { questions } = specialQuestionsContext ?? {};
    // const relevantMatchBets = bets.filter()
    console.log('contestantBetsData', contestantBetsData)
    const matchesScore = userMatchBets.reduce((sum, bet) => (sum + bet.score) , 0);
    const groupRankScore = Object.values(groupRankBets).reduce((sum, group) => (sum + (group.score ?? 0)) , 0);
    const specialBetScore = Object.values(specialBets).reduce((sum, bet) => (sum + (bet.score ?? 0)) , 0);
    useEffect(()=>{
        // matchesContext?.initialize();
        // betsContext?.initialize();
        fetch_matches();
        fetch_bets();
        fetch_teams();
        groupsContext?.initialize();
        specialQuestionsContext?.initialize();
    }, []);

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
                            {sortBy(userMatchBets, "type_id").map(renderMatchScore)}
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


const mapDispatchToProps = {
    fetch_matches,
    fetch_bets,
    fetch_teams,
}


export default connect(ContestantSelector, mapDispatchToProps)(Contestant);