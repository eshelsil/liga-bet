

const sendRequest = async () => {
  return {
    1: {
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
    2: {
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
  };
}
export const fetchGroups = sendRequest;