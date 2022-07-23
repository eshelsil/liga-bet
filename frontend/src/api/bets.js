import { BetTypes } from "../_enums/betTypes";
import { isDevModeTamir } from "../_helpers/dev";
import { sendApiRequest } from "./common/apiRequest";

const EXAMPLE_DATA = {
    // betId
    10: {
        type: 1,
        type_id: 4,
        user_tournament_id: 23,
        result_home: 0,
        result_away: 1,
        winner_side: 'away',
        relatedMatch: {
            home_team: {
                name: "Belgium",
                id: 10,
                crest_url: "https://crests.football-data.org/805.svg"
            },
            away_team: {
                name: "Nethelands",
                id: 6,
                crest_url: "https://crests.football-data.org/8601.svg"
            },
            result_home: null,
            result_away: null,
            winner_side: null,
            id: 4,
        },
        id: 10,
        score: null,
    },
    11: {
        type: 1,
        type_id: 4,
        user_tournament_id: 7,
        result_home: 0,
        result_away: 1,
        winner_side: 'away',
        relatedMatch: {
            home_team: {
                name: "Belgium",
                id: 10,
                crest_url: "https://crests.football-data.org/805.svg"
            },
            away_team: {
                name: "Nethelands",
                id: 6,
                crest_url: "https://crests.football-data.org/8601.svg"
            },
            result_home: null,
            result_away: null,
            winner_side: null,
            id: 4,
        },
        id: 11,
        score: null,
    },
    12: {
        type: 1,
        type_id: 4,
        user_tournament_id: 1,
        result_home: 0,
        result_away: 2,
        winner_side: 'away',
        relatedMatch: {
            home_team: {
                name: "Belgium",
                id: 10,
                crest_url: "https://crests.football-data.org/805.svg"
            },
            away_team: {
                name: "Nethelands",
                id: 6,
                crest_url: "https://crests.football-data.org/8601.svg"
            },
            result_home: null,
            result_away: null,
            winner_side: null,
            id: 4,
        },
        id: 12,
        score: null,
    },
    1: {
        type: 1,
        type_id: 3,
        user_tournament_id: 23,
        result_home: 0,
        result_away: 0,
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
        id: 1,
        score: 0,
    },
    2: {
        type: 1,
        type_id: 3,
        user_tournament_id: 7,
        result_home: 3,
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
        id: 2,
        score: 1,
    },
    3: {
        type: 1,
        type_id: 3,
        user_tournament_id: 20,
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
    4432: {
        type: 1,
        type_id: 3,
        user_tournament_id: 18,
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
        id: 4432,
        score: 3,
    },
    145: {
        type: 1,
        type_id: 2,
        user_tournament_id: 20,
        result_home: 1,
        result_away: 3,
        winner_side: 'away',
        relatedMatch: {
            home_team:  {
                name: "Austria",
                id: 5,
                crest_url: "https://crests.football-data.org/816.svg",
              },
              away_team:  {
                name: "Nethelands",
                id: 6,
                crest_url: "https://crests.football-data.org/8601.svg",
              },
              result_home: 1,
              result_away: 3,
              winner_side: 'away',
              id: 2,
        },
        id: 145,
        score: 9,
    },
    4: {
        type: 3,
        type_id: 4,
        user_tournament_id: 20,
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
    49: {
        type: 3,
        type_id: 4,
        user_tournament_id: 1,
        isDone: true,
        answer: {
            id: 2,
            name: 'Raul Gonzales Blanco',
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
        id: 49,
        score: 0,
    },
    50: {
        type: 3,
        type_id: 4,
        user_tournament_id: 23,
        isDone: true,
        answer: {
            id: 2,
            name: 'Raul Gonzales Blanco',
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
        id: 50,
        score: 0,
    },
    40: {
        type: 3,
        type_id: 1,
        user_tournament_id: 23,
        isDone: true,
        answer: {
            name: "Ukraine",
            id: 7,
            crest_url: "https://crests.football-data.org/790.svg"
        },
        relatedQuestion: {
            name: "Winner",
            answer: {
                name: "France",
                id: 8,
                crest_url: "https://crests.football-data.org/773.svg",
            },
            id: 1,
        },
        id: 40,
        score: 0,
    },
    41: {
        type: 3,
        type_id: 5,
        user_tournament_id: 4,
        isDone: false,
        answer: {
            name: "Switzerland",
            id: 9,
            crest_url: "https://crests.football-data.org/788.svg"
        },
        relatedQuestion: {
            name: "Top Scroer",
            answer: null,
            id: 5,
        },
        id: 41,
        score: 5,
    },
    5: {
        type: 2,
        type_id: 1,
        user_tournament_id: 20,
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
        type_id: 2,
        user_tournament_id: 20,
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
};

const fakeAPI = async () => {
    return EXAMPLE_DATA;
}

export const fetchBets = async (tournamentId) => {
    if (isDevModeTamir()) return await fakeAPI();
    return await $.ajax({
        type: 'GET',
        url: `/api/bets/${tournamentId}`,
        contentType: 'application/json',
        dataType: 'json',
    });
};

export const sendBet = async (tournamentId, betType, params) =>{
    const {bets = []} = await sendApiRequest({
        type: 'POST',
        url: `/api/bets/${tournamentId}`,
        data: JSON.stringify({
            bets: [{
                type: betType,
                data: params,
            }]
        }),
    })
    return bets[0]; 
};