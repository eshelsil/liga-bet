import { BetApiModel, WinnerSide } from "../types";
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
        winner_side: WinnerSide.Away,
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
        winner_side: WinnerSide.Away,
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
        winner_side: WinnerSide.Away,
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
        winner_side: WinnerSide.Home,
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
            winner_side: WinnerSide.Home,
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
        winner_side: WinnerSide.Home,
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
            winner_side: WinnerSide.Home,
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
        winner_side: WinnerSide.Home,
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
            winner_side: WinnerSide.Home,
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
        winner_side: WinnerSide.Home,
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
            winner_side: WinnerSide.Home,
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
        winner_side: WinnerSide.Away,
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
              winner_side: WinnerSide.Away,
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
        answer: 5,
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
        answer: 2,
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
        answer: 2,
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
        answer: 7,
        relatedQuestion: {
            name: "Winner",
            answer: 8,
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
        answer: 9,
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
        standings: [12, 11, 9, 10],
        relatedGroup: {
            name: "Group A",
            id: 1,
            isDone: true,
            standings: [10,9,11,12]
        },
        id: 5,
        score: 3,
    },
    6: {
        type: 2,
        type_id: 2,
        user_tournament_id: 20,
        standings: [5,6,7,8],
        relatedGroup: {
            name: "Group B",
            id: 2,
            isDone: true,
            standings: [7, 8, 6, 5],
          },
        id: 6,
        score: 6,
    },
};

const fakeAPI = async () => {
    return EXAMPLE_DATA;
}

type BetsApiResult = Record<number, BetApiModel>


export const fetchBets = async (tournamentId: string): Promise<BetsApiResult> => {
    if (isDevModeTamir()) return await fakeAPI();
    return await (window as any).$.ajax({
        type: 'GET',
        url: `/api/tournaments/${tournamentId}/bets`,
        contentType: 'application/json',
        dataType: 'json',
    });
};

export const sendBet = async (
    tournamentId: string,
    betType: BetTypes,
    params: object
) =>{
    const {bets = []} = await sendApiRequest({
        type: 'POST',
        url: `/api/tournaments/${tournamentId}/bets`,
        data: {
            bets: [{
                type: betType,
                data: params,
            }]
        },
    })
    return bets; 
};