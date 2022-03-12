

const sendRequest = async () => {
    return {
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
          id: 3,
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
          id: 2,
        },
    };
}
export const fetchMatches = sendRequest;