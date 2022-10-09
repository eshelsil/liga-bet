import { MatchRuleType, Team, WinnerSide } from '../../types'

export interface GameExample {
    bet: number[]
    qualifier?: WinnerSide
    game: {
        fullTime: number[]
        extraTime?: number[]
        penalties?: number[]
        homeTeam: Team
        awayTeam: Team
    }
}

export type GameBetScoreConfig = Record<MatchRuleType, number>
