import { WinnerSide } from "./match";

export enum BetType {
    Match = 1,
    GroupsRank = 2,
    Question = 3,
}

export interface BetBase {
    id: number,
    tournament_id?: number,
    user_tournament_id: number,
    type: BetType,
    type_id: number,
    score: number,
}

export interface MatchBetApiModel extends BetBase {
    result_home: number,
    result_away: number,
    winner_side: WinnerSide,
}

export interface GroupRankBetApiModel extends BetBase {
    standings: number[],
}

export interface QuestionBetApiModel extends BetBase {
    answer: number,
}

export type BetApiModel = QuestionBetApiModel | GroupRankBetApiModel | MatchBetApiModel

export type BetsApiModelById = Record<number, BetApiModel>