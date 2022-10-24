import { keyBy } from 'lodash'
import { fetchSpecialQuestions } from '../api/specialQuestions'
import { CollectionName } from '../types/dataFetcher'
import { AppDispatch, GetRootState } from '../_helpers/store'
import specialQuestions from '../_reducers/specialQuestions'
import { SpecialQuestions, TournamentIdSelector } from '../_selectors'
import { generateInitCollectionAction } from './utils'

function fetchAndStoreQuestions() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = TournamentIdSelector(getState())
        const questions = await fetchSpecialQuestions(tournamentId)
        const questionsById = keyBy(questions, 'id')
        dispatch(specialQuestions.actions.set({tournamentId, specialQuestions: questionsById}))
    }
}

const initSpecialQuestions = generateInitCollectionAction({
    collectionName: CollectionName.SpecialQuestions,
    selector: SpecialQuestions,
    fetchAction: fetchAndStoreQuestions,
})

export { fetchAndStoreQuestions, initSpecialQuestions }
