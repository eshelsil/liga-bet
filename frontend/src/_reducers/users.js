function users(state = {}, action) {
    switch (action.type) {
      case 'SET_USERS':
        return {
          ...action.data,
        }
      default:
        return state
    }
}
export default users;