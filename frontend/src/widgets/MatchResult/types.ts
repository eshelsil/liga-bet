import { Team, WinnerSide } from '../../types'


export interface TeamMacthData {
    team: Team,
    score: number,
    fullScore?: number,
}

export interface MatchResultProps {
    home: TeamMacthData
    away: TeamMacthData,
    isKnockout: boolean,
    qualifier?: WinnerSide,
    title?: string,
    isTwoLeggedTie?: boolean,
}
