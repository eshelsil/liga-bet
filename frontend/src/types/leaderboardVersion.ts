import { Dictionary } from '@reduxjs/toolkit'
import { ScoreboardRow, ScoreboardRowById } from './leaderboard'

export interface LeaderboardVersionBase {
    id: number
    description: string
    created_at: Date
}

export interface LeaderboardVersionApiModel extends LeaderboardVersionBase {
    leaderboard: ScoreboardRow[]
}

export interface LeaderboardVersion extends LeaderboardVersionBase {
    leaderboard: ScoreboardRowById
}

export type LeaderboardVersionById = Dictionary<LeaderboardVersion>
