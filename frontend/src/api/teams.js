

const sendRequest = async () => {
  return {
    10: {
      name: "Belgium",
      id: 10,
      crest_url: "https://crests.football-data.org/805.svg"
    },
    9: {
      name: "Switzerland",
      id: 9,
      crest_url: "https://crests.football-data.org/788.svg"
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
    5: {
      name: "Austria",
      id: 5,
      crest_url: "https://crests.football-data.org/816.svg"
    },
    6: {
      name: "Nethelands",
      id: 6,
      crest_url: "https://crests.football-data.org/8601.svg"
    },
    7: {
      name: "Ukraine",
      id: 7,
      crest_url: "https://crests.football-data.org/790.svg"
    },
    8: {
      name: "France",
      id: 8,
      crest_url: "https://crests.football-data.org/773.svg",
    },
  };
}
export const fetchTeams = sendRequest;