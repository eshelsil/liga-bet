import { fetchSpecialQuestions } from "../api/specialQuestions.ts";

function setQuestions(data) {
  return {
      type: 'SET_QUESTIONS',
      data,
  }
}

function fetchAndStoreQuestions() {
  return (dispatch) => {
    return fetchSpecialQuestions()
    .then( data => dispatch(setQuestions(data)) );
  }
}

export {
  fetchAndStoreQuestions,
}