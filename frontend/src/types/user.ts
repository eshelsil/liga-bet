

export enum UserRole {
    Admin = 'Admin',
    TournamentManager = 'TournamentManager',
    User = 'User',
}

export interface User {
    fcm_token: null,
    id: number,
    name: string,
    role: UserRole,
    username: string,
    isAdmin?: boolean,
}