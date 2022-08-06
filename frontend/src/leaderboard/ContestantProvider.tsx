import { Dictionary } from "lodash";
import React from "react";
import { connect } from "react-redux";
import { GroupRankBetWithRelations, MatchBetWithRelations, QuestionBetWithRelations, ScoreboardRow } from "../types";
import { ContestantSelector } from "../_selectors/leaderboard";
import { ContestantView } from "./ContestantView";


interface Props {
    matchBetsByUserId: Dictionary<MatchBetWithRelations[]>,
    groupStandingBetsByUserId: Dictionary<GroupRankBetWithRelations[]>,
    questionBetsByUserId: Dictionary<QuestionBetWithRelations[]>,
    scoreboardRow: ScoreboardRow,
}

export function Contestant({
    matchBetsByUserId,
    groupStandingBetsByUserId,
    questionBetsByUserId,
    scoreboardRow,
}: Props){
    const { userId } = scoreboardRow;
    const matchBets = matchBetsByUserId[userId] ?? [];
    const questionBets = questionBetsByUserId[userId] ?? [];
    const groupStandingsBets = groupStandingBetsByUserId[userId] ?? [];

    return (
        <ContestantView
            {...{
                matchBets,
                questionBets,
                groupStandingsBets,
                scoreboardRow,
            }}
        />
    );
}



export default connect(ContestantSelector)(Contestant)