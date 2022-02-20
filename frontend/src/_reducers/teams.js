function teams(state = {}, action) {
    switch (action.type) {
      case 'SET_TEAMS':
        return {
          ...action.data,
        }
      default:
        return state
    }
}
export default teams;