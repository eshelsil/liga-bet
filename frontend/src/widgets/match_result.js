import React from "react";

function MatchResult(props){
    const {matchData, winner_class = ''} = props;
    const {winner_side, result_home, result_away} = matchData;
    if (winner_side === "home"){
        return <React.Fragment>
            {result_away}:<span className={winner_class}>{result_home}</span>
        </React.Fragment>
    } else if (winner_side === "away"){
        return <React.Fragment>
            <span className={winner_class}>{result_away}</span>:{result_home}
        </React.Fragment>
    }
    return <React.Fragment>
        {result_away}:{result_home}
    </React.Fragment>
}

export default MatchResult;