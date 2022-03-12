import { fetchSpecialQuestions } from "../api/specialQuestions";

function set_questions(data) {
  return {
      type: 'SET_QUESTIONS',
      data,
  }
}

function fetch_questions() {
  return (dispatch) => {
    return fetchSpecialQuestions()
    .then( data => dispatch(set_questions(data)) );
  }
}

export {
  fetch_questions,
}