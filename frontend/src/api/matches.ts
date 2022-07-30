import { MatchApiModel, WinnerSide } from "../types";
import { isDevModeTamir } from "../_helpers/dev";
import { sendApiRequest } from "./common/apiRequest";


const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24;

const EXAMPLE_DATA = {
  1: {
    home_team: 8,
    away_team: 9,
    result_home: 4,
    result_away: 5,
    winner_side: WinnerSide.Away,
    is_done: true,
    closed_for_bets: true,
    start_time: new Date(Number(new Date()) - 2 * DAY),
    id: 1,
  },
  2: {
    home_team:  5,
    away_team:  6,
    result_home: 1,
    result_away: 3,
    winner_side: WinnerSide.Away,
    is_done: true,
    closed_for_bets: true,
    start_time: new Date(Number(new Date()) - 1 * DAY),
    id: 2,
  },
  3: {
    home_team: 10,
    away_team: 9,
    result_home: 3,
    result_away: 1,
    winner_side: WinnerSide.Home,
    is_done: true,
    closed_for_bets: true,
    start_time: new Date(Number(new Date()) - 1 * DAY),
    id: 3,
  },
  4: {
    home_team: 10,
    away_team: 6,
    result_home: null,
    result_away: null,
    winner_side: null,
    is_done: false,
    closed_for_bets: true,
    start_time: new Date(Number(new Date()) - HOUR ),
    id: 4,
  },
  5: {
    home_team: 12,
    away_team: 5,
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

const fakeAPI = async (): Promise<MatchApiResult> => {
  return EXAMPLE_DATA;
}

type MatchApiResult = Record<number, MatchApiModel>

export const fetchMatches = async (tournamentId: string): Promise<MatchApiResult> => {
    if (isDevModeTamir()) return await fakeAPI();
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/games`,
    });
};


export const updateScoresFromApi = async () => {
  (window as any).$.ajax({
      type: 'GET',
      url: '/api-fetch-games',
      success: function (server_msg) {
          const server_success_divider = "SERVER_SUCCESS_MSG:";
          const msg = server_msg.split(server_success_divider)[1];
          (window as any).toastr["success"](msg);
      },
      error: function(error) {
          console.log("error", error)
          const error_text = error.responseText;
          const server_error_divider = "SERVER_ERROR_MSG:";
          if (error_text.indexOf(server_error_divider) > -1){
            const error_msg = error_text.split(server_error_divider)[1];
            (window as any).toastr["error"](error_msg);
          } else {
            (window as any).toastr["error"](error_text);
          }
      }
  });
}