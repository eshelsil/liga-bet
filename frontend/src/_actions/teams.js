import { fetchTeams } from "../api/teams"
import { TournamentIdSelector } from "../_selectors/base";

function set_teams(data) {
    return {
        type: 'SET_TEAMS',
        data,
    }
}

function fetch_teams(data) {
    return (dispatch, getState) => {
        const tournamentId = TournamentIdSelector(getState());
        return fetchTeams(tournamentId)
        .then( data => dispatch(set_teams(data)) );
    }
}


export {
    fetch_teams,
}