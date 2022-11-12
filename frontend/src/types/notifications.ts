export interface TournamentNotifications {
    games: number[]
    questions: number[]
    groups: number[]
}

export type NotificationsByTournamentId = Record<number, TournamentNotifications>