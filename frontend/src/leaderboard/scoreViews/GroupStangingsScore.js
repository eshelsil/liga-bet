import React from "react";
import TeamWithFlag from '../../widgets/TeamWithFlag';


function Position({
    position,
    team,
}){
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


function GroupStangingsScore({
    bet,
}){
    const {id, score, standings, relatedGroup = {}} = bet;
    const {standings: finalStandings, isDone} = relatedGroup;
    if (!isDone){
        return null;
    }
    return <li key={id} className="list-group-item row flex-row  col-no-padding">
        <div className="col-xs-2 pull-right col-no-padding" style={{paddingRight: "15px"}}>{score}</div>
        <div className="col-xs-5 pull-right col-no-padding">
            {Object.entries(standings).map(
                ([rank, team])=> (
                    <Position key={rank} {...{rank, team}} />
                )
            )}
        </div>
        <div className="col-xs-5 pull-right col-no-padding">
            {isDone && (
                Object.entries(finalStandings).map(
                    ([rank, team])=> (
                        <Position key={rank} {...{rank, team}} />
                    )
                )
            )}
        </div>
    </li>
}

export default GroupStangingsScore;