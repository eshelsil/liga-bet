import { Team } from './teams'

export interface Group {
    id: number
    name: string
    isDone: boolean
    standings: Team[]
}

export interface GroupWithTeams extends Omit<Group, 'standings'> {
    teams: Team[]
    standings: Team[]
}

export type GroupsById = Record<number, Group>
