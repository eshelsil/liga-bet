import { fetchTeams } from "../api/teams.ts"
import { TournamentIdSelector } from "../_selectors/base";

function setTeams(data) {
    return {
        type: 'SET_TEAMS',
        data,
    }
}

function fetchAndStoreTeams() {
    return (dispatch, getState) => {
        const tournamentId = TournamentIdSelector(getState());
        return fetchTeams(tournamentId)
        .then( data => dispatch(setTeams(data)) );
    }
}


export {
    fetchAndStoreTeams,
}