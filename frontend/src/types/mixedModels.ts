import { MatchBetApiModel } from './bet'
import { Match, MatchWithGoalsData } from './match'

export interface MatchWithBets extends Match {
    betsByValue: Record<string, MatchBetApiModel[]>
}

export type GameWithBetsAndGoalsData = MatchWithBets & MatchWithGoalsData