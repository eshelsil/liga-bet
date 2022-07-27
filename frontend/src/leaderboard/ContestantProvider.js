import React from "react";
import { connect } from "react-redux";
import { ContestantSelector } from "../_selectors";
import { ContestantView } from "./ContestantView";


export function Contestant({
    userId,
    matchBetsByUserId,
    groupStandingBetsByUserId,
    questionBetsByUserId,
    ...viewProps
}){
    const matchBets = matchBetsByUserId[userId] ?? [];
    const questionBets = questionBetsByUserId[userId] ?? [];
    const groupStandingsBets = groupStandingBetsByUserId[userId] ?? [];

    return (
        <ContestantView
            {...{
                matchBets,
                questionBets,
                groupStandingsBets,
                ...viewProps,
            }}
        />
    );
}



export default connect(ContestantSelector)(Contestant)