import { getUser } from "../api/users";

function set_current_user(data) {
  return {
      type: 'SET_CURRENT_USER',
      data,
  }
}

function fetch_current_user(data) {
  return (dispatch) => {
      return getUser()
      .then( data => {
        dispatch(set_current_user(data));
      })
  }
}


export {
  fetch_current_user,
}