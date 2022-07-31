
export enum UtlRole {
    Admin = 'Admin',
    Manager = 'Manager',
    User = 'User',
}

export interface UTL {
    id: number,
    name?: string,
    tournament_id?: number,
    role?: UtlRole,
}

export type UTLsById = Record<number, UTL>