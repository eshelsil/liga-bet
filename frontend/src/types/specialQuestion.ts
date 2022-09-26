import { Team } from './teams';
import { Player } from './player';
import { Dictionary } from 'lodash';


export enum SpecialQuestionType {
    Winner = 'winner',
    RunnerUp = 'runner_up',
    TopScorer = 'top_scorer',
    TopAssists = 'most_assists',
    MVP = 'mvp',
    OffensiveTeamGroupStage = 'offensive_team',
}

export enum SpecialAnswerType {
    Team = 'team',
    Player = 'player',
}

export type SpecialQuestionAnswer = Team | Player

export interface SpecialQuestionBase {
    id: number,
    type: SpecialQuestionType,
}

export interface SpecialQuestionApiModel extends SpecialQuestionBase {
    answer: number | number[],
}

export interface SpecialQuestion extends SpecialQuestionBase {
    name: string
    answer: SpecialQuestionAnswer[],
}

export type SpecialQuestionsApiModelById = Record<number, SpecialQuestionApiModel>
export type SpecialQuestionsById = Dictionary<SpecialQuestion>