const sendRequest = async () => {
    return {
        1: {
            rank: 1,
            rankDisplay: 1,
            change: 0,
            id: 1,
            user_id: 20,
            name: "Eliyahu Hanavim",
            addedScore: 9,
            total_score: 27,
            relevantMatchBets: [],
            groupRankBets: {},
            specialBets: {},
        },
    };
}
export const fetchLeaderboard = sendRequest;