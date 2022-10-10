import { keyBy } from 'lodash'
import { fetchSpecialQuestions } from '../api/specialQuestions'
import { AppDispatch, GetRootState } from '../_helpers/store'
import specialQuestions from '../_reducers/specialQuestions'
import { TournamentIdSelector } from '../_selectors'

function fetchAndStoreQuestions() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        const tournamentId = TournamentIdSelector(getState())
        const questions = await fetchSpecialQuestions(tournamentId)
        const questionsById = keyBy(questions, 'id')
        dispatch(specialQuestions.actions.set(questionsById))
    }
}

export { fetchAndStoreQuestions }
