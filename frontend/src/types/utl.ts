import { Tournament } from './tournament';

export enum UtlRole {
    Admin = 'admin',
    Manager = 'manager',
    Contestant = 'contestant',
    NotConfirmed = 'not_confirmed',
    Rejected = 'rejected',
    Monkey = 'monkey',
}


export interface UtlBase {
    id: number,
    name: string,
    role: UtlRole,
}

export interface UTL extends UtlBase{
    tournament_id: number,
}

export interface UtlWithTournament extends UtlBase {
    tournament: Tournament,
}

export type UTLsById = Record<number, UTL>

export type MyUtlsById = Record<number, UtlWithTournament>