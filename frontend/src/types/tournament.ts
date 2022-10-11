import { EnumRecord } from "./common";
import { SpecialQuestionType } from "./specialQuestion";

export enum TournamentStatus {
    Initial = 'initial',
    Ongoing = 'ongoing',
    Finished = 'finished',
}

// Todo: needs refinement
export enum CompetitionStageName {
	QuarterFinal = 'quarterFinal',
	SemiFinal = 'semiFinal',
	Final = 'final',
	Winning = 'winning',
}

// Todo: needs refinement
export enum GameStage {
	GroupStage = 'groupStage',
	Last16 = 'last16',
	QuarterFinal = 'quarterFinal',
	SemiFinal = 'semiFinal',
	Final = 'final',
	Knockout = 'knockout',
}

export type RoadToFinalBetScoreConfig = EnumRecord<CompetitionStageName, number>

export interface EachGoalBet {
	correct: number,
	eachGoal: number,
};

export interface SpecialQuestionBetScoreConfig {
	[SpecialQuestionType.TopAssists]?: number,
	[SpecialQuestionType.MVP]?: number,
	[SpecialQuestionType.OffensiveTeamGroupStage]?: number,
	[SpecialQuestionType.TopScorer]?: EachGoalBet,
	[SpecialQuestionType.Winner]?: RoadToFinalBetScoreConfig,
	[SpecialQuestionType.RunnerUp]?: RoadToFinalBetScoreConfig,
}

export interface GameBetScoreConfig {
	winnerSide: number,
	result: number,
	qualifier?: number,
}

export interface GroupRankBetScoreConfig {
	perfect: number,
	minorMistake: number,
}

export type MatchBetsScoreConfig = EnumRecord<GameStage, GameBetScoreConfig>

export interface TournamentScoreConfig {
    gameBets: MatchBetsScoreConfig,
    groupRankBets: GroupRankBetScoreConfig,
    specialBets: SpecialQuestionBetScoreConfig,
}

export interface TournamentConfig extends TournamentScoreConfig {
	prizes: string[],
}

export interface Tournament {
    id: number,
    name: string,
    status: TournamentStatus,
    competitionId: number,
    config: TournamentConfig,
    code: string,
}
