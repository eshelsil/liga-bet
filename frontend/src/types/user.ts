export enum UserPermissions {
    Admin = 2,
    TournamentAdmin = 1,
    User = 0,
    Monkey = -1,
}

export interface User {
    id: number
    permissions: UserPermissions
    email: string
    canUpdateScoreConfig?: boolean
}
