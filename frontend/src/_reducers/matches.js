function matches(state = {}, action) {
    switch (action.type) {
      case 'UPDATE_MATCHES':
        return {
          ...state,
          ...action.data,
        };
      default:
        return state;
    }
}
export default matches;