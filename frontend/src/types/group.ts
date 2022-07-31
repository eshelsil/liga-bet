import { Team } from "./teams"

export interface Group {
    id: number,
    name: string,
    isDone: boolean,
    standings: number[],
}

export interface GroupWithTeams extends Group {
    teams: Team[],
}

export type GroupsById = Record<number, Group>