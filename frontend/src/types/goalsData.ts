import { Player } from './player'

export interface GameGoalsData {
    id: number
    playerId: number
    gameId: number
    goals: number
    assists: number
}

export interface GameGoalsDataWithPlayer extends GameGoalsData {
    player: Player
}

export type GameGoalsDataById = Record<number, GameGoalsData[]>
