const sendRequest = async () => {
    return {
        // betId
        3: {
            type: 1,
            type_id: 3,
            user_id: 20,
            data: {
                result_home: 5,
                result_away: 2,
                winner_side: 'home',
            },
            id: 3,
            score: 3,
        },
        4: {
            type: 3,
            type_id: 4,
            user_id: 20,
            data: {
                answer: 5,
            },
            id: 4,
            score: 5,
        },
    }
}
export const fetchBets = sendRequest;