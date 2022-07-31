export interface Group {
    id: number,
    name: string,
    isDone: boolean,
    standings: number[],
}

export type GroupsById = Record<number, Group>