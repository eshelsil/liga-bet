import { ScoreboardRow } from "../types";
import { LeaderboardVersion } from "../types";
import {isDevModeTamir} from "../_helpers/dev";
import {sendApiRequest} from "./common/apiRequest";


type LeaderboardApiResult = LeaderboardVersion[]

const EXAMPLE_DATA = [
    {
        "id":2,
        "description":"",
        "created_at":new Date("2022-08-12T12:25:16.000000Z"),
        "leaderboard":[
            {"id":16,"user_tournament_id":9,"rank":1,"score":3},
            {"id":17,"user_tournament_id":14,"rank":1,"score":3},
            {"id":18,"user_tournament_id":16,"rank":3,"score":1},
            {"id":19,"user_tournament_id":12,"rank":3,"score":1},
            {"id":20,"user_tournament_id":5,"rank":3,"score":1},
            {"id":21,"user_tournament_id":15,"rank":3,"score":1},
            {"id":22,"user_tournament_id":8,"rank":7,"score":0},
            {"id":23,"user_tournament_id":17,"rank":7,"score":0},
            {"id":24,"user_tournament_id":10,"rank":7,"score":0},
            {"id":25,"user_tournament_id":1,"rank":7,"score":0},
            {"id":26,"user_tournament_id":11,"rank":7,"score":0},
            {"id":27,"user_tournament_id":4,"rank":7,"score":0},
            {"id":28,"user_tournament_id":13,"rank":7,"score":0},
            {"id":29,"user_tournament_id":6,"rank":7,"score":0},
            {"id":30,"user_tournament_id":7,"rank":7,"score":0}
        ]
    },
    {
        "id":1,
        "description":"",
        "created_at":new Date("2022-08-12T12:22:16.000000Z"),
        "leaderboard":[
            {"id":1,"user_tournament_id":13,"rank":1,"score":1},
            {"id":2,"user_tournament_id":6,"rank":1,"score":1},
            {"id":3,"user_tournament_id":4,"rank":3,"score":0},
            {"id":4,"user_tournament_id":12,"rank":3,"score":0},
            {"id":5,"user_tournament_id":5,"rank":3,"score":0},
            {"id":6,"user_tournament_id":14,"rank":3,"score":0},
            {"id":7,"user_tournament_id":7,"rank":3,"score":0},
            {"id":8,"user_tournament_id":15,"rank":3,"score":0},
            {"id":9,"user_tournament_id":8,"rank":3,"score":0},
            {"id":10,"user_tournament_id":16,"rank":3,"score":0},
            {"id":11,"user_tournament_id":9,"rank":3,"score":0},
            {"id":12,"user_tournament_id":17,"rank":3,"score":0},
            {"id":13,"user_tournament_id":10,"rank":3,"score":0},
            {"id":14,"user_tournament_id":1,"rank":3,"score":0},
            {"id":15,"user_tournament_id":11,"rank":3,"score":0}
        ]
    }
];

const fakeAPI = async (): Promise<LeaderboardApiResult> => {
    return EXAMPLE_DATA;
}

export const fetchLeaderboard = async (tournamentId: number): Promise<LeaderboardApiResult> => {
    if (isDevModeTamir()) return await fakeAPI();
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/leaderboards`,
    });
};