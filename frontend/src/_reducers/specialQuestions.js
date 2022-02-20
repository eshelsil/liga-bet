function specialQuestions(state = {}, action) {
    switch (action.type) {
      case 'SET_QUESTIONS':
        return {
          ...action.data,
        }
      default:
        return state
    }
}
export default specialQuestions;