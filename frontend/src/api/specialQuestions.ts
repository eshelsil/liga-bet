import { SpecialQuestionApiModel, SpecialQuestionType } from '../types';
import { sendApiRequest } from './common/apiRequest';

type QuestionsApiResult = SpecialQuestionApiModel[]

const sendRequest = async (): Promise<QuestionsApiResult> => {
  return [
    {
      id: 1,
      answer: null,
      type: SpecialQuestionType.Winner,
    },
    {
      answer: null,
      type: SpecialQuestionType.RunnerUp,
      id: 2,
    },
    {
      answer: null,
      type: SpecialQuestionType.OffensiveTeamGroupStage,
      id: 6,
    },
    {
      answer: 5,
      type: SpecialQuestionType.TopScorer,
      id: 3,
    },
    {
      answer: 5,
      type: SpecialQuestionType.TopAssists,
      id: 4,
    },
    {
      answer: null,
      type: SpecialQuestionType.MVP,
      id: 5,
    },
  ];
}

export const fetchSpecialQuestions = sendRequest;

// export async function fetchSpecialQuestions(tournamentId: number) {
//   return await sendApiRequest({
//     url: `/api/tournaments/${tournamentId}/special-questions`,
//   });
// };