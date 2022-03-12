const sendRequest = async () => {
  return {
    4: {
      // name: "top_scorer",
      name: "Top Scroer",
      answer: {
        id: 5,
        name: 'David Vialla',
        crest_url: 'https://crests.football-data.org/760.svg',
      },
      id: 4,
    },
    5: {
      // name: "offensive_team",
      name: "Team with most goals on groups stage",
      answer: {
        id: 5,
        name: 'Austria',
        crest_url: 'https://crests.football-data.org/816.svg',
      },
      id: 5,
    },
    1: {
      name: "winner",
      question: "Winner",
      answer: null,
      id: 1,
    },
  };
}
export const fetchSpecialQuestions = sendRequest;