import { fetchUsers } from "../api/users"

function set_users(data) {
  return {
      type: 'SET_USERS',
      data,
  }
}
function fetch_users() {
  return (dispatch) => {
    return fetchUsers()
    .then( data => dispatch(set_users(data)) );
  }
}

export {
  fetch_users,
}