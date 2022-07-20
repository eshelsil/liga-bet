function tournamentUser(state = {}, action) {
    switch (action.type) {
      case 'SET_CURRENT_TOURNAMENT_USER':
        return {
          ...action.data,
        }
      default:
        return state
    }
}
export default tournamentUser;