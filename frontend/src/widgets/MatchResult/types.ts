import { Team, WinnerSide } from '../../types'
import { BracketSpecialRole } from '../../utils'


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
    isAutoBet?: boolean,
    title?: string,
    isTwoLeggedTie?: boolean,
    homeRole?: BracketSpecialRole,
    awayRole?: BracketSpecialRole,
}
