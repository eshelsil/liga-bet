import { Team } from './teams'

export enum WinnerSide {
    Away = 'away',
    Home = 'home',
}

export enum KnockoutStage {
	Final = 'final',
	SemiFinal = 'semiFinal',
    QuarterFinal = 'quarterFinal',
	Last16 = 'last16',
}

export interface MatchCommonBase {
    id: number
    result_home: number
    result_away: number
    winner_side: WinnerSide
    is_done: boolean
    closed_for_bets: boolean
    start_time: Date
    is_knockout?: boolean
}

export interface MatchApiModel extends MatchCommonBase {
    home_team: number
    away_team: number
}

export interface Match extends MatchCommonBase {
    home_team: Team
    away_team: Team
}

export interface MatchResult {
    result_home: number
    result_away: number
    winner_side?: WinnerSide
}

export type MatchApiModelById = Record<number, MatchApiModel>
