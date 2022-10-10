import { CompetitionsById } from '../types'
import { sendApiRequest } from './common/apiRequest'

export const getCompetitions = async (): Promise<CompetitionsById> => {
    return await sendApiRequest({
        url: '/api/competitions',
    })
}
