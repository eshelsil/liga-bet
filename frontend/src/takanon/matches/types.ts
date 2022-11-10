import { Team, WinnerSide } from '../../types'


export interface GameExample {
    bet: number[]
    qualifier?: WinnerSide
    custom?: boolean
    game: {
        fullTime: number[]
        extraTime?: number[]
        penalties?: number[]
        homeTeam: Team
        awayTeam: Team
        isKnockout?: boolean
    }
}