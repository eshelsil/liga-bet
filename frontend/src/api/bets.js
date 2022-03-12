const sendRequest = async () => {
    return {
        // betId
        3: {
            type: 1,
            // type_id: 3,
            user_id: 20,
            result_home: 5,
            result_away: 2,
            winner_side: 'home',
            relatedMatch: {
                home_team: {
                    name: "Belgium",
                    id: 10,
                    crest_url: "https://crests.football-data.org/805.svg"
                },
                away_team: {
                    name: "Switzerland",
                    id: 9,
                    crest_url: "https://crests.football-data.org/788.svg"
                },
                result_home: 3,
                result_away: 1,
                winner_side: 'home',
                id: 3,
            },
            id: 3,
            score: 3,
        },
        4: {
            type: 3,
            // type_id: 4,
            user_id: 20,
            isDone: true,
            answer: {
                id: 5,
                name: 'David Vialla',
                crest_url: 'https://crests.football-data.org/760.svg',
            },
            relatedQuestion: {
                name: "Top Scroer",
                answer: {
                    id: 5,
                    name: 'David Vialla',
                    crest_url: 'https://crests.football-data.org/760.svg',
                },
                id: 4,
            },
            id: 4,
            score: 5,
        },
        5: {
            type: 2,
            // type_id: 1,
            user_id: 20,
            standings: [
                {
                    name: "Finland",
                    id: 12,
                    crest_url: "https://crests.football-data.org/1976.svg",
                },
                {
                    name: "Russia",
                    id: 11,
                    crest_url: "https://crests.football-data.org/808.svg"
                },
                {
                    name: "Switzerland",
                    id: 9,
                    crest_url: "https://crests.football-data.org/788.svg"
                },
                {
                    name: "Belgium",
                    id: 10,
                    crest_url: "https://crests.football-data.org/805.svg"
                },
            ],
            relatedGroup: {
                name: "Group A",
                id: 1,
                isDone: true,
                standings: [
                    {
                        name: "Belgium",
                        id: 10,
                        crest_url: "https://crests.football-data.org/805.svg"
                    },
                    {
                        name: "Switzerland",
                        id: 9,
                        crest_url: "https://crests.football-data.org/788.svg"
                    },
                    {
                        name: "Russia",
                        id: 11,
                        crest_url: "https://crests.football-data.org/808.svg"
                    },
                    {
                        name: "Finland",
                        id: 12,
                        crest_url: "https://crests.football-data.org/1976.svg",
                    },
                ]
            },
            id: 5,
            score: 3,
        },
        6: {
            type: 2,
            // type_id: 2,
            user_id: 20,
            standings: [
                {
                    name: "Austria",
                    id: 5,
                    crest_url: "https://crests.football-data.org/816.svg"
                },
                {
                    name: "Nethelands",
                    id: 6,
                    crest_url: "https://crests.football-data.org/8601.svg"
                },
                {
                    name: "Ukraine",
                    id: 7,
                    crest_url: "https://crests.football-data.org/790.svg"
                },
                {
                    name: "France",
                    id: 8,
                    crest_url: "https://crests.football-data.org/773.svg",
                },
            ],
            relatedGroup: {
                name: "Group B",
                id: 2,
                isDone: true,
                standings: [
                    {
                        name: "Ukraine",
                        id: 7,
                        crest_url: "https://crests.football-data.org/790.svg"
                    },
                    {
                        name: "France",
                        id: 8,
                        crest_url: "https://crests.football-data.org/773.svg",
                    },
                    {
                        name: "Nethelands",
                        id: 6,
                        crest_url: "https://crests.football-data.org/8601.svg"
                    },
                    {
                        name: "Austria",
                        id: 5,
                        crest_url: "https://crests.football-data.org/816.svg"
                    },
                ],
              },
            id: 6,
            score: 6,
        },
    }
}
export const fetchBets = sendRequest;