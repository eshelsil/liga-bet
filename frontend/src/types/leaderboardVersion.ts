import { ScoreboardRow } from '../types';

export interface LeaderboardVersion {
    id: number,
    description: string,
    created_at: Date,
    leaderboard: ScoreboardRow[],
}