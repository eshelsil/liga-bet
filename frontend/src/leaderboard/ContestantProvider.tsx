import { Dictionary } from "lodash";
import React from "react";
import { connect } from "react-redux";
import {
    GroupRankBetWithRelations,
    MatchBetWithRelations,
    QuestionBetWithRelations,
    ScoreboardRowDetailed,
} from "../types";
import { ContestantSelector } from "../_selectors";
import { ContestantView } from "./ContestantView";


interface Props {
    matchBetsByUserId: Dictionary<MatchBetWithRelations[]>,
    groupStandingBetsByUserId: Dictionary<GroupRankBetWithRelations[]>,
    questionBetsByUserId: Dictionary<QuestionBetWithRelations[]>,
    scoreboardRow: ScoreboardRowDetailed,
    rankDisplay: string,
}

export function Contestant({
    matchBetsByUserId,
    groupStandingBetsByUserId,
    questionBetsByUserId,
    scoreboardRow,
    rankDisplay,
}: Props){
    const { user_tournament_id } = scoreboardRow;
    const matchBets = matchBetsByUserId[user_tournament_id] ?? [];
    const questionBets = questionBetsByUserId[user_tournament_id] ?? [];
    const groupStandingsBets = groupStandingBetsByUserId[user_tournament_id] ?? [];

    return (
        <ContestantView
            {...{
                rankDisplay,
                matchBets,
                questionBets,
                groupStandingsBets,
                scoreboardRow,
            }}
        />
    );
}



export default connect(ContestantSelector)(Contestant)