function leaderboard(state = {}, action) {
    switch (action.type) {
      case 'SET_LEADERBOARD':
        return {
          ...action.data,
        }
      default:
        return state
    }
}
export default leaderboard;