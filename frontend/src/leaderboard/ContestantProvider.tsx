import { Dictionary } from "lodash";
import React from "react";
import { connect } from "react-redux";
import {
    GroupRankBetWithRelations,
    MatchBetWithRelations,
    QuestionBetWithRelations,
    ScoreboardRow,
    UtlRole
} from "../types";
import { ContestantSelector } from "../_selectors";
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
    const { user_tournament_id } = scoreboardRow;
    const matchBets = matchBetsByUserId[user_tournament_id] ?? [];
    const questionBets = questionBetsByUserId[user_tournament_id] ?? [];
    const groupStandingsBets = groupStandingBetsByUserId[user_tournament_id] ?? [];
    // TODO: const utl = utlsById[user_tournament_id] ?? [];
    const utl = {
        id: 1,
        name: "bla",
        role: UtlRole.User,
        tournament_id: 5,
    };

    return (
        <ContestantView
            {...{
                matchBets,
                questionBets,
                groupStandingsBets,
                scoreboardRow,
                utl,
            }}
        />
    );
}



export default connect(ContestantSelector)(Contestant)