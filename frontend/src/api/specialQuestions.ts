import { SpecialQuestionApiModel } from '../types'
import { sendApiRequest } from './common/apiRequest'

type QuestionsApiResult = SpecialQuestionApiModel[]

export async function fetchSpecialQuestions(
    tournamentId: number
): Promise<QuestionsApiResult> {
    return await sendApiRequest({
        url: `/api/tournaments/${tournamentId}/special-questions`,
    })
}
