import { Dictionary } from '@reduxjs/toolkit'

export interface ScoreboardRow {
    id: number
    user_tournament_id: number
    rank: number
    score: number
}

export type ScoreboardRowById = Dictionary<ScoreboardRow>

export interface ScoreboardRowDetailed extends ScoreboardRow {
    change: number
    addedScore: number
    name: string
}
