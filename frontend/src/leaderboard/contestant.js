import React from "react";
import { sortBy } from "lodash";
import { connect } from "react-redux";
import { ContestantSelector } from "../_selectors/main";
import TeamWithFlag from '../widgets/team_with_flag';
import MatchResult from "../widgets/match_result";



function renderPosition(position, team){
    if (!team){
        return
    }
    const {crest_url, name} = team;
    return <div key={position} className="flex-row">
        <span>({position}) </span>
        <TeamWithFlag name={name} crest_url={crest_url}
        ></TeamWithFlag>
    </div>
}

function renderRankChange(change){
    if (change > 0){
        return <bdi><span className="label label-success" style={{direction: "ltr"}} dir="RTL">+{change}</span></bdi>
    } else if (change < 0){
        return <bdi><span className="label label-danger" style={{direction: "ltr"}} dir="RTL">{change}</span></bdi>
    }
    return null;
}

function formatSpecialAnswer(specialQuestionType, answer){
    switch (specialQuestionType){
        case 1: // winner
        case 5: // offensive_team
        case 4: // top scorer
            const {name, crest_url} = answer;
            return <TeamWithFlag name={name} crest_url={crest_url}/>
        case 2: // mvp
            return answer;
        default:
            return null;
    }
}

function renderSpecialBetScore(specialBet){
    const { id, score, answer, relatedQuestion } = specialBet;
    const {id: questionId, name, isDone, answer: finalAnswer} = relatedQuestion;
    return <li key={questionId} className="list-group-item row flex-row col-no-padding" style={{paddingRight: "10px"}}>
        <div className="col-xs-1 pull-right col-no-padding">{score}</div>
        <div className="col-xs-3 pull-right col-no-padding">{name}</div>
        <div className="col-xs-4 pull-right col-no-padding">{formatSpecialAnswer(questionId, answer)}</div>
        <div className="col-xs-4 pull-right col-no-padding">
            <div>{formatSpecialAnswer(questionId, finalAnswer)}</div>
        </div>
    </li>
}

function renderGroupRankScore(groupRankBet){
    const {id, score, standings, relatedGroup = {}} = groupRankBet;
    const {standings: finalStandings, isDone} = relatedGroup;
    if (!isDone){
        return null;
        // Should select only bets with score
    }
    console.log({standings, finalStandings})
    return <li key={id} className="list-group-item row flex-row  col-no-padding">
        <div className="col-xs-2 pull-right col-no-padding" style={{paddingRight: "15px"}}>{score}</div>
        <div className="col-xs-5 pull-right col-no-padding">
            {Object.entries(standings).map(([rank, team])=>{
                return renderPosition(rank, team);
            })}
        </div>
        <div className="col-xs-5 pull-right col-no-padding">
            {isDone &&(
                Object.entries(finalStandings).map(([rank, team])=>{
                    return renderPosition(rank, team);
                })
            )}
        </div>
    </li>
}

function renderMatchScore(bet){
    const {id, score, result_home, result_away, winner_side, relatedMatch} = bet;
    if (!relatedMatch){
        return null;
    }
    if (!score) {
        return null
        // Should select only bets with score (instead of this if statement)
    };
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
    const {rank, rankDisplay, change, id, user_id, name, addedScore, total_score} = props;
    const { betsByUserID } = props;

    const userBetsByType = betsByUserID[user_id] ?? {};
    const userMatchBets = userBetsByType[BetTypes.Match] ?? [];
    const userSpecialQuestionBets = userBetsByType[BetTypes.SpecialBet] ?? [];
    const userGroupRankBets = userBetsByType[BetTypes.GroupsRank] ?? [];

    const matchesScore = userMatchBets.reduce((sum, bet) => (sum + bet.score) , 0);
    const groupRankScore = userGroupRankBets.reduce((sum, bet) => (sum + (bet.score ?? 0)) , 0);
    const specialBetScore = userSpecialQuestionBets.reduce((sum, bet) => (sum + (bet.score ?? 0)) , 0);

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
                            {sortBy(userGroupRankBets, 'id').map(renderGroupRankScore)}
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
                            {sortBy(userSpecialQuestionBets, 'id').map(renderSpecialBetScore)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
}



export default connect(ContestantSelector)(Contestant);