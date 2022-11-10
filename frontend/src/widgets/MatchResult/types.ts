import { Team, WinnerSide } from '../../types'


export interface TeamMacthData {
    team: Team,
    score: number,
    fullScore?: number,
}

export interface MatchResultProps {
    home: TeamMacthData
    away: TeamMacthData,
    qualifier?: WinnerSide,
    title?: string,
}
