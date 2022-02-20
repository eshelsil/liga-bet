function matches(state = {}, action) {
    switch (action.type) {
      case 'UPDATE_BETS':
        return {
          ...state,
          ...action.data,
        };
      case 'UPDATE_BET':
        const { id, data } = action;
        const { bet } = state[id];
        return {
          ...state,
          [id]: {
            ...bet,
            ...data,
          },
        };
      default:
        return state;
    }
}
export default matches;