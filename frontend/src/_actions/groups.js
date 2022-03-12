import { fetchGroups } from "../api/groups";

function set_groups(data) {
  return {
      type: 'SET_GROUPS',
      data,
  }
}

function fetch_groups(data) {
  return (dispatch) => {
      return fetchGroups()
      .then( data => dispatch(set_groups(data)) );
  }
}


export {
  fetch_groups,
}