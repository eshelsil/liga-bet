function users(state = {}, action) {
    switch (action.type) {
      case 'SET_CURRENT_USER':
        return {
          ...action.data,
        }
      default:
        return state
    }
}
export default users;