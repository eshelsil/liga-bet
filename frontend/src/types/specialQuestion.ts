import { Team } from "./teams"

export enum SpecialQuestionType {
    Winner = 1,
    MVP = 2,
    RunnerUp = 3,
    TopScorer = 4,
    OffensiveTeamGroupStage = 5,
    TopAssists = 6,
}

// interface Player {
//     //TBD
// }
type Player = Team;

export type SpecialQuestionAnswer = Team | Player

export interface SpecialQuestion {
    id: number,
    type: SpecialQuestionType,
    name: string,
    answer: number,
}

export type SpecialQuestionsById = Record<number, SpecialQuestion>