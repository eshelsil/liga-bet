import React from 'react';
import { sortBy } from 'lodash';
import { sumBetsScore } from './utils';
import GroupRankScore from './scoreViews/GroupStangingsScore';
import MatchBetScore from './scoreViews/MatchBetScore';
import QuestionBetScore from './scoreViews/QuestionBetScore';


function RankChange({
    change,
}){
    if (change > 0){
        return <bdi><span className="label label-success" style={{direction: "ltr"}} dir="RTL">+{change}</span></bdi>
    } else if (change < 0){
        return <bdi><span className="label label-danger" style={{direction: "ltr"}} dir="RTL">{change}</span></bdi>
    }
    return null;
}


export function ContestantView({
    rank,
    rankDisplay,
    change,
    id,
    name,
    addedScore,
    totalScore,
    matchBets,
    groupStandingsBets,
    questionBets,
}){
    const matchesScore = sumBetsScore(matchBets);
    const groupStandingsScore = sumBetsScore(groupStandingsBets);
    const specialBetScore = sumBetsScore(questionBets);

    return <div className="panel-group" style={{marginBottom: 0}}>
        <div className="panel panel-default">
                <div className={`panel-heading row rank-${rank}`} style={{marginRight: 0, marginLeft: 0}}>
                <div className="col-xs-2 pull-right col-no-padding">
                    <div className="col-xs-6 col-no-padding">{rankDisplay}</div>
                    <div className="col-xs-6 col-no-padding" style={{marginRight: "-7px", marginLeft: "7px", marginTop: "-2px"}}>
                        <RankChange change={change} />
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
                <div className="col-xs-1 pull-right col-no-padding" style={{paddingRight: "7px"}}>{totalScore}</div>
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
                            {sortBy(matchBets, "type_id").map(bet =>
                                <MatchBetScore key={bet.id} bet={bet} />
                            )}
                        </ul>
                    </div>
                    <div id={`group-ranks-${id}`} className="tab-pane fade" style={{padding: "20px"}}>
                        <h3>סה"כ: {groupStandingsScore}</h3>
                        <ul className="list-group" style={{paddingRight: "0px"}}>
                            <li className="list-group-item row" style={{background: "#d2d2d2"}}>
                                <div className="col-xs-2 pull-right col-no-padding">ניקוד</div>
                                <div className="col-xs-5 pull-right col-no-padding">הימור</div>
                                <div className="col-xs-5 pull-right col-no-padding">תוצאה</div>
                            </li>
                            {sortBy(groupStandingsBets, 'id').map( bet =>
                                <GroupRankScore key={bet.id} bet={bet} />
                            )}
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
                            {sortBy(questionBets, 'id').map( questionBet =>
                                <QuestionBetScore key={questionBet.id} questionBet={questionBet} />
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
}



export default ContestantView;