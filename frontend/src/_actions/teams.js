import { fetchTeams } from "../api/teams"

function set_teams(data) {
    return {
        type: 'SET_TEAMS',
        data,
    }
}

function fetch_teams(data) {
    return (dispatch) => {
        return fetchTeams()
        .then( data => dispatch(set_teams(data)) );
    }
}


export {
    fetch_teams,
}