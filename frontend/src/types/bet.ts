import { Group, GroupWithTeams } from "./group";
import { Match, WinnerSide } from "./match";
import { SpecialQuestion } from "./specialQuestion";
import { Team } from "./teams";

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
    utlName?: string,
}

export interface MatchBetApiModel extends BetBase {
    result_home: number,
    result_away: number,
    winner_side: WinnerSide,
}

export interface MatchBetWithRelations extends MatchBetApiModel {
    relatedMatch: Match,
}

export interface GroupRankBetApiModel extends BetBase {
    standings: number[],
}
export interface GroupRankBetWithRelations extends BetBase {
    standings: Team[],
    relatedGroup: GroupWithTeams,
}

export interface QuestionBetApiModel extends BetBase {
    answer: number,
}

export interface QuestionBetWithRelations extends QuestionBetApiModel {
    relatedQuestion: SpecialQuestion,
    // answer?: any,
}

export type BetApiModel = QuestionBetApiModel | GroupRankBetApiModel | MatchBetApiModel

export type BetsApiModelById = Record<number, BetApiModel>

export interface MatchWithABet extends Match {
    bet: MatchBetWithRelations
}