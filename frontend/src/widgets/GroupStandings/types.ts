import { Team } from '../../types'


export interface TeamDisplayProps {
    team: Team,
    rank: number,
    highlight?: boolean,
}

export interface GroupStandingProps {
    standings: Team[],
    name?: string,
    highlightRank?: number, // mark the row at this rank (1-based)
}
