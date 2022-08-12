import { SpecialQuestion } from '../types';

type QuestionsApiResult = Record<number, SpecialQuestion>

const sendRequest = async (): Promise<QuestionsApiResult> => {
  return {
    4: {
      // name: "top_scorer",
      name: "Top Scroer",
      answer: 5,
      type: 4,
      id: 4,
    },
    5: {
      // name: "offensive_team",
      name: "Team with most goals on groups stage",
      answer: 5,
      type: 5,
      id: 5,
    },
    1: {
      name: "winner",
      answer: null,
      type: 1,
      id: 1,
    },
  };
}

export const fetchSpecialQuestions = sendRequest;