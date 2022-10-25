import { EnumRecord } from "./common";
import { KnockoutStage } from "./match";
import { SpecialQuestionType } from "./specialQuestion";

export enum TournamentStatus {
    Initial = 'initial',
    OpenForBets = 'open',
    Ongoing = 'ongoing',
    Finished = 'done',
}

// Todo: needs refinement
export enum CompetitionStageName {
	QuarterFinal = 'quarterFinal',
	SemiFinal = 'semiFinal',
	Final = 'final',
	Winning = 'winning',
}

export enum GameBetType {
	GroupStage = 'groupStage',
	Knockout = 'knockout',
	Bonus = 'bonuses',
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

export type GameBetBonusesScoreConfig = EnumRecord<KnockoutStage, GameBetScoreConfig>

export interface GroupRankBetScoreConfig {
	perfect: number,
	minorMistake: number,
}

export interface MatchBetsScoreConfig {
	[GameBetType.GroupStage]: GameBetScoreConfig,
	[GameBetType.Knockout]: GameBetScoreConfig,
	[GameBetType.Bonus]: GameBetBonusesScoreConfig,
}

export type SpecialQuestionFlagConfig = Record<SpecialQuestionType, boolean>

export interface TournamentScoreConfig {
    gameBets: MatchBetsScoreConfig,
    groupRankBets: GroupRankBetScoreConfig,
    specialBets: SpecialQuestionBetScoreConfig,
    specialQuestionFlags: SpecialQuestionFlagConfig,
}

export interface TournamentConfig {
	prizes: string[],
	scores: TournamentScoreConfig,
}

export interface Tournament {
    id: number,
    name: string,
    status: TournamentStatus,
    competitionId: number,
    config: TournamentConfig,
    code: string,
	creatorUserId: number,
}