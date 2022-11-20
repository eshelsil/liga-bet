export interface GameGoalsData {
    id: number
    playerId: number
    gameId: number
    goals: number
    assists: number
}

export type GameGoalsDataById = Record<number, GameGoalsData[]>
