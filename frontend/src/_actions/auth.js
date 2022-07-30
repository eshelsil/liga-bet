import { getUser } from "../api/users.ts";

function setCurrentUser(data) {
  return {
      type: 'SET_CURRENT_USER',
      data,
  }
}

function fetchAndStoreCurrentUser() {
  return (dispatch) => {
      return getUser()
      .then( data => {
        dispatch(setCurrentUser(data));
      })
  }
}


export {
  fetchAndStoreCurrentUser,
}