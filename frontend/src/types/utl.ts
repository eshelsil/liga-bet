import { Tournament } from './tournament';

export enum UtlRole {
    Admin = 'Admin',
    Manager = 'Manager',
    User = 'User',
}


export interface UTL {
    id: number,
    name: string,
    role: UtlRole,
    tournament_id: number,
}

export interface UtlWithTournament {
    id: number,
    name: string,
    role: UtlRole,
    tournament: Tournament,
}

export type UTLsById = Record<number, UTL>

export type MyUtlsById = Record<number, UtlWithTournament>