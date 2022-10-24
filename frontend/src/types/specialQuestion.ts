import { Team } from './teams'
import { Player } from './player'
import { Dictionary } from 'lodash'

export enum SpecialQuestionType {
    Winner = 'winner',
    RunnerUp = 'runnerUp',
    TopScorer = 'topScorer',
    TopAssists = 'topAssists',
    MVP = 'mvp',
    OffensiveTeamGroupStage = 'offensiveTeam',
}

export enum SpecialAnswerType {
    Team = 'team',
    Player = 'player',
}

export type SpecialQuestionAnswer = Team | Player

export interface SpecialQuestionBase {
    id: number
    type: SpecialQuestionType
}

export interface SpecialQuestionApiModel extends SpecialQuestionBase {
    answer: number | number[]
}

export interface SpecialQuestion extends SpecialQuestionBase {
    name: string
    answer: SpecialQuestionAnswer[]
}

export type SpecialQuestionsApiModelById = Record<
    number,
    SpecialQuestionApiModel
>
export type SpecialQuestionsById = Dictionary<SpecialQuestion>
