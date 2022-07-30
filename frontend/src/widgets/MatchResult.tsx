import React from "react";
import { MatchResult, WinnerSide } from "../types";

interface Props {
    matchData: MatchResult,
    winner_class?: string,
}

function MatchResult({
    matchData,
    winner_class = '',
}: Props){
    const {winner_side, result_home, result_away} = matchData;
    if (winner_side === WinnerSide.Home){
        return <>
            {result_away}:<span className={winner_class}>{result_home}</span>
        </>
    } else if (winner_side === WinnerSide.Away){
        return <>
            <span className={winner_class}>{result_away}</span>:{result_home}
        </>
    }
    return <>
        {result_away}:{result_home}
    </>
}

export default MatchResult;