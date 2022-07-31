import { fetchSpecialQuestions } from '../api/specialQuestions';
import { AppDispatch } from '../_helpers/store';
import specialQuestions from '../_reducers/specialQuestions';

function fetchAndStoreQuestions() {
  return (dispatch: AppDispatch) => {
    return fetchSpecialQuestions()
    .then( data => specialQuestions.actions.set(data) );
  }
}

export {
  fetchAndStoreQuestions,
}