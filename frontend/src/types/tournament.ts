import { BetType } from "./bet";
import { BracketScoreConfig } from "./bracket";
import { EnumRecord } from "./common";
import { Competition } from "./competition";
import { KnockoutStage } from "./match";
import { SpecialQuestionType } from "./specialQuestion";
import { UtlRole } from "./utl";

export enum TournamentStatus {
    Initial = 'initial',
    Ongoing = 'ongoing',
    Finished = 'done',
}

// Contract A — tournament type. Absent/undefined === classic (back-compat).
export enum TournamentType {
    Classic = 'classic',
    KnockoutBracket = 'knockout_bracket',
}

// Todo: needs refinement
export enum CompetitionStageName {
	Last16 = 'last16',
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
	[SpecialQuestionType.TopAssists]?: number | EachGoalBet,
	[SpecialQuestionType.MVP]?: number,
	[SpecialQuestionType.OffensiveTeamGroupStage]?: number,
	[SpecialQuestionType.DefensiveTeamGroupStage]?: number,
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
    bracket?: BracketScoreConfig, // contract F — present only for knockout_bracket tournaments
}

export interface TournamentConfig {
	prizes: string[],
	scores: TournamentScoreConfig,
	sideTournamentGames?: Record<number, number[]>,
}

export interface TournamentPreferences {
	auto_approve_users: boolean,
	use_default_config_answered: boolean,
	enable_auto_bet: boolean,
}

export interface SideTournamentConfig {
	prizes?: string[],
	competingUtls?: number[],
}

export interface SideTournament {
    id: number,
    tournament_id: number,
    name: string,
    emblem: string,
    gameIds: number[],
    competingUtls: number[],
    config?: SideTournamentConfig,
}

export interface Tournament {
    id: number,
    name: string,
    status: TournamentStatus,
    competitionId: number,
    competition: Competition,
    config: TournamentConfig,
    type?: TournamentType, // contract A — absent === classic
    code: string,
	creatorUserId: number,
	sideTournaments?: SideTournament[],
	preferences?: TournamentPreferences,
}


export interface DetailedContestantData {
	id: number,
	name: string,
	role: UtlRole,
	email: string,
	bets: EnumRecord<BetType, number>
}
export interface TournamentSummaryData {
	id: number,
	name: string,
	config: TournamentConfig,
	contestants: DetailedContestantData[],
	betEntities: EnumRecord<BetType, number>
	creatorUtlId: number,
}