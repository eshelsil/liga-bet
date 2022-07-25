import {isDevModeTamir} from "../_helpers/dev";
import { sendApiRequest } from "./common/apiRequest";


const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24;

const EXAMPLE_DATA = {
    1: {
      home_team:  {
        name: "France",
        id: 8,
        crest_url: "https://crests.football-data.org/773.svg",
      },
      away_team:  {
        name: "Switzerland",
        id: 9,
        crest_url: "https://crests.football-data.org/788.svg"
      },
      result_home: 4,
      result_away: 5,
      winner_side: 'away',
      is_done: true,
      closed_for_bets: true,
      start_time: new Date(new Date() - 2 * DAY),
      id: 1,
    },
    2: {
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
      is_done: true,
      closed_for_bets: true,
      start_time: new Date(new Date() - 1 * DAY),
      id: 2,
    },
    3: {
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
      is_done: true,
      closed_for_bets: true,
      start_time: new Date(new Date() - 1 * DAY),
      id: 3,
    },
    4: {
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
      is_done: false,
      closed_for_bets: true,
      start_time: new Date(new Date() - HOUR ),
      id: 4,
    },
    5: {
      home_team: {
        name: "Finland",
        id: 12,
        crest_url: "https://crests.football-data.org/1976.svg",
      },
      away_team: {
        name: "Austria",
        id: 5,
        crest_url: "https://crests.football-data.org/816.svg"
      },
      result_home: null,
      result_away: null,
      winner_side: null,
      is_done: false,
      closed_for_bets: false,
      is_knockout: true,
      start_time: new Date(Number(new Date()) + HOUR),
      id: 5,
    },
  };
const fakeAPI = async () => {
  return EXAMPLE_DATA;
}

export const fetchMatches = async (tournamentId) => {
    if (isDevModeTamir()) return await fakeAPI();
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/games`,
    });
};


export const updateScoresFromApi = async () => {
  $.ajax({
      type: 'GET',
      url: '/api-fetch-games',
      success: function (server_msg) {
          const server_success_divider = "SERVER_SUCCESS_MSG:";
          const msg = server_msg.split(server_success_divider)[1];
          toastr["success"](msg);
          // setTimeout(()=>{window.location.reload()}, 3000);
      },
      error: function(error) {
          console.log("error", error)
          const error_text = error.responseText;
          const server_error_divider = "SERVER_ERROR_MSG:";
          if (error_text.indexOf(server_error_divider) > -1){
              const error_msg = error_text.split(server_error_divider)[1];
              toastr["error"](error_msg);
          } else {
              toastr["error"](error_text);
          }
      }
  });
}