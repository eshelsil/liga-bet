import { Dictionary } from '@reduxjs/toolkit'
import { ScoreboardRowById } from './leaderboard'
import { Match } from './match'

export interface LeaderboardVersionApiModel {
    id: number
    description: string
    created_at: string
    gameId: number
}

export interface LeaderboardVersion extends LeaderboardVersionApiModel {
    order: number
    isPlaceholder?: boolean
}

export interface LeaderboardVersionWithGame extends LeaderboardVersion {
    game: Match
}

export interface LeaderboardVersionWithScoreboard extends LeaderboardVersion {
    leaderboard: ScoreboardRowById
}

export type LeaderboardVersionById = Dictionary<LeaderboardVersion>
