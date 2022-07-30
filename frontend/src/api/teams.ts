import { Team } from "../types";
import { isDevModeTamir } from "../_helpers/dev";
import { sendApiRequest } from "./common/apiRequest";


const fakeAPI = async () => {
  return {
    "1": {
        "id": 1,
        "external_id": "791",
        "name": "Ecuador",
        "crest_url": "https://crests.football-data.org/791.svg",
        "group_id": "1",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "2": {
        "id": 2,
        "external_id": "8601",
        "name": "Netherlands",
        "crest_url": "https://crests.football-data.org/8601.svg",
        "group_id": "1",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "3": {
        "id": 3,
        "external_id": "8030",
        "name": "Qatar",
        "crest_url": "https://crests.football-data.org/8030.svg",
        "group_id": "1",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "4": {
        "id": 4,
        "external_id": "804",
        "name": "Senegal",
        "crest_url": "https://crests.football-data.org/senegal.svg",
        "group_id": "1",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "5": {
        "id": 5,
        "external_id": "770",
        "name": "England",
        "crest_url": "https://crests.football-data.org/770.svg",
        "group_id": "2",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "6": {
        "id": 6,
        "external_id": "840",
        "name": "Iran",
        "crest_url": "https://crests.football-data.org/iran.svg",
        "group_id": "2",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "7": {
        "id": 7,
        "external_id": "771",
        "name": "United States",
        "crest_url": "https://crests.football-data.org/usa.svg",
        "group_id": "2",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "8": {
        "id": 8,
        "external_id": "833",
        "name": "Wales",
        "crest_url": "https://crests.football-data.org/833.svg",
        "group_id": "2",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "9": {
        "id": 9,
        "external_id": "762",
        "name": "Argentina",
        "crest_url": "https://crests.football-data.org/762.png",
        "group_id": "3",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "10": {
        "id": 10,
        "external_id": "769",
        "name": "Mexico",
        "crest_url": "https://crests.football-data.org/769.svg",
        "group_id": "3",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "11": {
        "id": 11,
        "external_id": "794",
        "name": "Poland",
        "crest_url": "https://crests.football-data.org/794.svg",
        "group_id": "3",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "12": {
        "id": 12,
        "external_id": "801",
        "name": "Saudi Arabia",
        "crest_url": "https://crests.football-data.org/saudi_arabia.svg",
        "group_id": "3",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "13": {
        "id": 13,
        "external_id": "779",
        "name": "Australia",
        "crest_url": "https://crests.football-data.org/779.svg",
        "group_id": "4",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "14": {
        "id": 14,
        "external_id": "782",
        "name": "Denmark",
        "crest_url": "https://crests.football-data.org/782.svg",
        "group_id": "4",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "15": {
        "id": 15,
        "external_id": "773",
        "name": "France",
        "crest_url": "https://crests.football-data.org/773.svg",
        "group_id": "4",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "16": {
        "id": 16,
        "external_id": "802",
        "name": "Tunisia",
        "crest_url": "https://crests.football-data.org/tunisia.svg",
        "group_id": "4",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "17": {
        "id": 17,
        "external_id": "793",
        "name": "Costa Rica",
        "crest_url": "https://crests.football-data.org/costa_rica.svg",
        "group_id": "5",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "18": {
        "id": 18,
        "external_id": "759",
        "name": "Germany",
        "crest_url": "https://crests.football-data.org/759.svg",
        "group_id": "5",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "19": {
        "id": 19,
        "external_id": "766",
        "name": "Japan",
        "crest_url": "https://crests.football-data.org/766.svg",
        "group_id": "5",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "20": {
        "id": 20,
        "external_id": "760",
        "name": "Spain",
        "crest_url": "https://crests.football-data.org/760.svg",
        "group_id": "5",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "21": {
        "id": 21,
        "external_id": "805",
        "name": "Belgium",
        "crest_url": "https://crests.football-data.org/805.svg",
        "group_id": "6",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "22": {
        "id": 22,
        "external_id": "828",
        "name": "Canada",
        "crest_url": "https://crests.football-data.org/canada.svg",
        "group_id": "6",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "23": {
        "id": 23,
        "external_id": "799",
        "name": "Croatia",
        "crest_url": "https://crests.football-data.org/799.svg",
        "group_id": "6",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "24": {
        "id": 24,
        "external_id": "815",
        "name": "Morocco",
        "crest_url": "https://crests.football-data.org/morocco.svg",
        "group_id": "6",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "25": {
        "id": 25,
        "external_id": "764",
        "name": "Brazil",
        "crest_url": "https://crests.football-data.org/764.svg",
        "group_id": "7",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "26": {
        "id": 26,
        "external_id": "781",
        "name": "Cameroon",
        "crest_url": "https://crests.football-data.org/cameroon.svg",
        "group_id": "7",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "27": {
        "id": 27,
        "external_id": "780",
        "name": "Serbia",
        "crest_url": "https://crests.football-data.org/780.svg",
        "group_id": "7",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "28": {
        "id": 28,
        "external_id": "788",
        "name": "Switzerland",
        "crest_url": "https://crests.football-data.org/788.svg",
        "group_id": "7",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "29": {
        "id": 29,
        "external_id": "763",
        "name": "Ghana",
        "crest_url": "https://crests.football-data.org/ghana.svg",
        "group_id": "8",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "30": {
        "id": 30,
        "external_id": "765",
        "name": "Portugal",
        "crest_url": "https://crests.football-data.org/765.svg",
        "group_id": "8",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "31": {
        "id": 31,
        "external_id": "772",
        "name": "South Korea",
        "crest_url": "https://crests.football-data.org/772.png",
        "group_id": "8",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    },
    "32": {
        "id": 32,
        "external_id": "758",
        "name": "Uruguay",
        "crest_url": "https://crests.football-data.org/758.svg",
        "group_id": "8",
        "created_at": "2022-07-24T19:54:34.000000Z",
        "updated_at": "2022-07-24T19:54:34.000000Z",
        "competition_id": 2
    }
};
}

type TeamsApiResult = Record<number, Team>

export const fetchTeams = async (tournamentId: string): Promise<TeamsApiResult> => {
  return await fakeAPI();
  // if (isDevModeTamir()) return await fakeAPI();
  // return await sendApiRequest({
  //   url: `/api/tournaments/${tournamentId}/teams`,
  // });
};