import { BetType } from "./bet";
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
}

export interface TournamentConfig {
	prizes: string[],
	scores: TournamentScoreConfig,
	sideTournamentGames?: Record<number, number>,
}

export interface TournamentPreferences {
	auto_approve_users: boolean,
	use_default_config_answered: boolean,
}

export interface SideTournament {
    id: number,
    tournament_id: number,
    name: string,
    emblem: string,
    gameIds: number[],
}

export interface Tournament {
    id: number,
    name: string,
    status: TournamentStatus,
    competitionId: number,
    competition: Competition,
    config: TournamentConfig,
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