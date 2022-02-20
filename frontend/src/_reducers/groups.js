function groups(state = {}, action) {
    switch (action.type) {
      case 'SET_GROUPS':
        return {
          ...action.data,
        }
      default:
        return state
    }
}
export default groups;