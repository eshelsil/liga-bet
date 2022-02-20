

const sendRequest = async () => {
  return {
    10: {
      name: "Belgium",
      id: 10,
      crest_url: "https://crests.football-data.org/805.svg"
    },
    9: {
      name: "Denemark",
      id: 9,
      crest_url: "https://crests.football-data.org/782.svg"
    },
    11: {
      name: "Russia",
      id: 11,
      crest_url: "https://crests.football-data.org/808.svg"
    },
    12: {
      name: "Finland",
      id: 12,
      crest_url: "https://crests.football-data.org/1976.svg",
    },
  };
}
export const fetchTeams = sendRequest;