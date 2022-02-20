

const sendRequest = async () => {
    return {
        3: {
          home_team: 10,
          away_team: 9,
          result_home: 3,
          result_away: 1,
          winner_side: 'home',
          id: 3,
        },
        2: {
          home_team: 3,
          away_team: 6,
          result_home: 1,
          result_away: 3,
          winner_side: 'away',
          id: 2,
        },
    };
}
export const fetchMatches = sendRequest;