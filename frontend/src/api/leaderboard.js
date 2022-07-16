const sendRequest = async () => {
    return {
        1: {
            rank: 1,
            rankDisplay: 1,
            change: 1,
            id: 1,
            user_id: 20,
            name: "Eliyahu Hanavim",
            addedScore: 9,
            total_score: 27,
            // relevantMatchBets: [],
            // groupRankBets: {},
            // specialBets: {},
        },
        2: {
            rank: 2,
            rankDisplay: 2,
            change: -1,
            id: 23,
            user_id: 23,
            name: "Simha Riff Cohen",
            addedScore: 2,
            total_score: 25,
            // relevantMatchBets: [],
            // groupRankBets: {},
            // specialBets: {},
        },
    };
}
export const fetchLeaderboard = sendRequest;