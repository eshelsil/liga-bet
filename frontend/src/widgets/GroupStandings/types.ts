import { Team } from '../../types'


export interface TeamDisplayProps {
    team: Team,
    rank: number,
}

export interface GroupStandingProps {
    standings: Team[],
    name: string,
}
