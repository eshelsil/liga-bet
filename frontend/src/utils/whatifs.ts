import { ScoresConfigFromatted } from "@/_selectors";
import { mapValues } from "lodash";
import { calcGainedPointsOnGameBet } from "./liveScores";
import { MatchBetWithRelations } from "@/types";

export function calcWhatifAddedScore({
    betsByUtlId,
    config
}: {
    betsByUtlId: Record<number, MatchBetWithRelations[]>,
    config: ScoresConfigFromatted
}){
    return mapValues(betsByUtlId, (matchBets, utlId): number => {
        let addedScore = 0;
        for (const gameBet of matchBets ){
            addedScore += calcGainedPointsOnGameBet(gameBet, config.gameBets)
        }
        return addedScore
    })
}