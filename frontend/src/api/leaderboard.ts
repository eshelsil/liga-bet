import { ScoreboardRow } from "../types/leaderboard";


type LeaderboardApiResult = ScoreboardRow[]

const sendRequest = async (): Promise<LeaderboardApiResult> => {
    return [
        {
            rank: 1,
            rankDisplay: '1',
            change: 1,
            id: 1,
            userId: 1,
            name: "Isam Tuka",
            addedScore: 9,
            totalScore: 27,
        },
        {
            rank: 2,
            rankDisplay: '2',
            change: -1,
            id: 23,
            userId: 23,
            name: "Simha Riff Cohen",
            addedScore: 2,
            totalScore: 25,
        },
    ];
}
export const fetchLeaderboard = sendRequest;