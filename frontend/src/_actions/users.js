import { fetchUsers } from "../api/users.ts"

function setUsers(data) {
  return {
      type: 'SET_USERS',
      data,
  }
}
function fetchAndStoreUsers() {
  return (dispatch) => {
    return fetchUsers()
    .then( data => dispatch(setUsers(data)) );
  }
}

export {
  fetchAndStoreUsers,
}